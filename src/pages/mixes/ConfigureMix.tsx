import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageBody from '../../components/pageLayout/pageBody/pageBody';
import PageContainer from '../../components/pageLayout/pageContainer/PageContainer';
import { ScrollableContainer } from '../../components/scrollableContainer/ScrollableContainer';
import { MixStrip } from '../../components/strips/mixStrip/MixStrip';
import { EffectsPanel } from '../../components/strips/stripComponents/audioFilters/EffectsPanel';
import { InputDropdown } from '../../components/ui/inputDropdown/InputDropdown';
import { ConfirmationModal } from '../../components/ui/modals/confirmationModal/ConfirmationModal';
import { Select } from '../../components/ui/select/Select';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { TAudioStrip, TMixStrip } from '../../types/types';
import {
  addMixToMix,
  addStripToMix,
  removeInputFromMix,
  removeMix
} from '../../utils/wsCommands';

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
  const savedMixesWithoutPFL = useMemo(
    () => mixes.filter((mix) => mix.stripId !== 1000),
    [mixes]
  );
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
    setAllInputs([...strips, ...savedMixesWithoutPFL]);
  }, [strips, savedMixesWithoutPFL]);

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
      removeInputFromMix(sendMessage, parseInt(mixId), stripId, type);
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
      <div className="flex flex-row justify-between p-5 pb-0 items-center">
        <div className="flex flew-row space-x-4 items-center">
          <h1>Configure Mix: </h1>
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
        </div>
        <InputDropdown
          selectedInputs={usedInputs}
          options={allInputs.filter((input) => input.stripId !== 1000)}
          label="Add input"
          mixToConfigure={mixToConfigure?.stripId}
          addInput={handleAddInput}
          removeInput={handleRemoveInputFromMix}
        />
      </div>
      <PageBody>
        {mixToConfigure && (
          <div className="p-4">
            <MixStrip
              key={`mix-${mixToConfigure.stripId}`}
              {...mixToConfigure}
              isPFLInactive={
                isPFL?.inputs?.mixes[mixToConfigure.stripId]?.muted ?? undefined
              }
              onStripSelect={handleSelection}
              onRemove={handleRemoveMix}
              isBeingConfigured={true}
            />
          </div>
        )}
        {/* Inputs that belong to the conf-mix */}
        <div className="p-4 overflow-x-hidden w-full">
          <ScrollableContainer
            configurableMixStrips={mixToConfigure}
            isPFL={isPFL}
            onStripSelect={handleSelection}
            handleRemoveStripFromMix={handleRemoveInputFromMix}
          />
        </div>

        {selectedStrip !== null && (
          <EffectsPanel
            strip={
              selectedStrip.type === 'mixes'
                ? mixes.find((mix) => mix.stripId === selectedStrip.id)
                : strips.find((strip) => strip.stripId === selectedStrip.id)
            }
            type={selectedStrip.type}
            isConfigPage={true}
            onClose={() => setIsFirstMount(true)}
          />
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
