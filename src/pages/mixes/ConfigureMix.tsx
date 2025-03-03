import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageBody from '../../components/pageLayout/pageBody/pageBody';
import PageContainer from '../../components/pageLayout/pageContainer/PageContainer';
import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import { ScrollableContainer } from '../../components/scrollableContainer/ScrollableContainer';
import { EffectsPanel } from '../../components/strips/stripComponents/audioFilters/EffectsPanel';
import { MixStrip } from '../../components/strips/mixStrip/MixStrip';
import { InputDropdown } from '../../components/ui/inputDropdown/InputDropdown';
import { ConfirmationModal } from '../../components/ui/modals/confirmationModal/ConfirmationModal';
import { Select } from '../../components/ui/select/Select';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { TAudioStrip, TMixStrip } from '../../types/types';
import {
  addMixToMix,
  addStripToMix,
  removeMix,
  removeMixFromMix,
  removeStripFromMix
} from '../../utils/utils';

export const ConfigureMixPage = () => {
  const { mixId } = useParams();
  const navigate = useNavigate();
  const [selectedStrip, setSelectedStrip] = useState<{
    id: number;
    type: 'mixes' | 'strips';
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [allInputs, setAllInputs] = useState<(TAudioStrip | TMixStrip)[]>([]);
  const [usedInputs, setUsedInputs] = useState<(TAudioStrip | TMixStrip)[]>([]);
  const [mixToConfigure, setMixToConfigure] = useState<TMixStrip | undefined>(
    undefined
  );
  const { sendMessage } = useWebSocket();
  const { strips, mixes, setMixes, setStrips } = useGlobalState();
  const savedMixesWithoutPFL = mixes.filter((mix) => mix.stripId !== 1000);
  const isPFL = useMemo(() => mixes?.find((m) => m.stripId === 1000), [mixes]);

  useEffect(() => {
    if (!isFirstMount) return;

    setStrips((prevStrips) =>
      prevStrips.map((strip) => ({
        ...strip,
        selected: false
      }))
    );

    setMixes((prevMixes) =>
      prevMixes.map((mix) => ({
        ...mix,
        selected: false
      }))
    );

    setSelectedStrip(null);
    setIsFirstMount(false);
  }, [isFirstMount, setMixes, setStrips]);

  useEffect(() => {
    if (isFirstMount) return;

    const selStrip = strips.find((strip) => strip.selected === true);
    const selMix = mixes.find((mix) => mix.selected === true);

    if (selStrip) {
      setSelectedStrip({ id: selStrip.stripId, type: 'strips' });
    } else if (selMix) {
      setSelectedStrip({ id: selMix.stripId, type: 'mixes' });
    }
  }, [strips, mixes, isFirstMount]);

  useEffect(() => {
    if (mixes && mixId) {
      const mixToConf = mixes.find((mix) => mix.stripId.toString() === mixId);
      setMixToConfigure(mixToConf);
    }
  }, [mixId, mixes]);

  useEffect(() => {
    if (mixToConfigure && mixToConfigure.inputs) {
      const mixesArray = Object.keys(mixToConfigure.inputs.mixes);
      const stripsArray = Object.keys(mixToConfigure.inputs.strips);

      const mixesUsed = mixes.filter((mix) =>
        mixesArray.some((m) => {
          return parseInt(m) === mix.stripId;
        })
      );

      const stripsUsed = strips.filter((strip) =>
        stripsArray.some((s) => {
          return parseInt(s) === strip.stripId;
        })
      );

      setUsedInputs([...mixesUsed, ...stripsUsed]);
    }
  }, [mixToConfigure, mixes, strips]);

  useEffect(() => {
    const newInputsString = JSON.stringify(
      [...strips, ...savedMixesWithoutPFL].map((item) => item.stripId)
    );
    const currentInputsString = JSON.stringify(
      allInputs.map((item) => item.stripId)
    );

    if (newInputsString !== currentInputsString) {
      setAllInputs([...strips, ...savedMixesWithoutPFL]);
    }
  }, [strips, savedMixesWithoutPFL, allInputs]);

  const handleAddInput = (input: TAudioStrip | TMixStrip) => {
    const isMix = input.inputs !== undefined;
    if (mixToConfigure?.stripId === input.stripdId && isMix) {
      return;
    }
    if (mixId) {
      if (!isMix) {
        addStripToMix(sendMessage, parseInt(mixId), input.stripId);
      } else {
        addMixToMix(sendMessage, parseInt(mixId), input.stripId);
      }
    }
  };

  const handleRemoveInputFromMix = ({
    stripId,
    type
  }: {
    stripId: number;
    type: 'mixes' | 'strips';
  }) => {
    if (mixId) {
      if (type !== 'mixes') {
        removeStripFromMix(sendMessage, parseInt(mixId), stripId);
      } else {
        removeMixFromMix(sendMessage, parseInt(mixId), stripId);
      }
    }
  };

  const handleRemoveMix = () => {
    if (mixId) {
      removeMix(parseInt(mixId), sendMessage);
      navigate('/mixes', { replace: true });
    }
  };

  const handleSelection = (
    stripId: number | null,
    type: 'mixes' | 'strips'
  ) => {
    setSelectedStrip(stripId ? { id: stripId, type: type } : null);

    setMixes((prevMixes) =>
      prevMixes.map((mix) => ({
        ...mix,
        selected: (stripId === mix.stripId && type === 'mixes') || false
      }))
    );

    setStrips((prevStrips) =>
      prevStrips.map((strip) => ({
        ...strip,
        selected: (stripId === strip.stripId && type === 'strips') || false
      }))
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Configure Mix:"
        titleElement={
          <Select
            value={
              mixToConfigure?.label || mixToConfigure?.stripId.toString() || ''
            }
            options={savedMixesWithoutPFL}
            onChange={(value) => {
              setIsFirstMount(true);
              navigate(`/mixes/${value.stripId}`, { replace: true });
            }}
            className="ml-2"
          />
        }
      >
        <InputDropdown
          selectedInputs={usedInputs}
          options={allInputs}
          label="Add input"
          mixToConfigure={mixToConfigure?.stripId}
          addInput={handleAddInput}
          removeInput={handleRemoveInputFromMix}
        />
      </PageHeader>
      <PageBody>
        {mixToConfigure && (
          <div className="p-4">
            <MixStrip
              key={`mix-${mixToConfigure.stripId}`}
              {...mixToConfigure}
              isPFLActive={
                isPFL?.inputs?.mixes[mixToConfigure.stripId]?.muted !==
                undefined
                  ? !isPFL.inputs.mixes[mixToConfigure.stripId].muted
                  : undefined
              }
              onStripSelect={handleSelection}
              onRemove={handleRemoveMix}
              isBeingConfigured={true}
            />
          </div>
        )}
        {/* Inputs that belong to the conf-mix */}
        <div className="w-full max-w-full overflow-hidden h-full p-4">
          <ScrollableContainer
            configurableMixStrips={mixToConfigure}
            isRemovingFromMix={true}
            isPFL={isPFL}
            onStripSelect={handleSelection}
            handleRemoveStripFromMix={handleRemoveInputFromMix}
          />
        </div>

        {selectedStrip !== null && (
          <div className="p-4">
            <EffectsPanel
              strip={
                selectedStrip.type === 'mixes'
                  ? mixes.find((mix) => mix.stripId === selectedStrip.id)
                  : strips.find((strip) => strip.stripId === selectedStrip.id)
              }
              type={selectedStrip.type}
            />
          </div>
        )}
        <ConfirmationModal
          isOpen={isModalOpen}
          title="Remove mix"
          message={`Are you sure you want to remove mix ${mixToConfigure?.label || mixToConfigure?.stripId.toString()}?`}
          confirmText="Yes, remove mix"
          onConfirm={handleRemoveMix}
          onClose={() => setIsModalOpen(false)}
        />
      </PageBody>
    </PageContainer>
  );
};
