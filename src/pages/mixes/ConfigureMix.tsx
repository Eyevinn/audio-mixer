import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import { ScrollableContainer } from '../../components/scrollableContainer/ScrollableContainer';
import { EffectsPanel } from '../../components/strips/audioFilters/EffectsPanel';
import { MixStrip } from '../../components/strips/mixStrip/MixStrip';
import { InputDropdown } from '../../components/ui/inputDropdown/InputDropdown';
import { ConfirmationModal } from '../../components/ui/modals/confirmationModal/ConfirmationModal';
import { Select } from '../../components/ui/select/Select';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { useData } from '../../hooks/useData';
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
  const [selectedStrip, setSelectedStrip] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [allInputs, setAllInputs] = useState<(TAudioStrip | TMixStrip)[]>([]);
  const [mixesToPass, setMixesToPass] = useState<TMixStrip[]>([]);
  const [audioStripsToPass, setAudioStripsToPass] = useState<TAudioStrip[]>([]);
  const [usedInputs, setUsedInputs] = useState<(TAudioStrip | TMixStrip)[]>([]);
  const [mixToConfigure, setMixToConfigure] = useState<TMixStrip | undefined>(
    undefined
  );
  const { sendMessage } = useWebSocket();
  const { savedStrips, savedMixes, setSavedMixes, setSavedStrips } =
    useGlobalState();

  useData();

  useEffect(() => {
    const selectedStrip = savedStrips.find((strip) => strip.selected === true);
    const selectedMix = savedMixes.find((mix) => mix.selected === true);

    if (selectedStrip) {
      setSelectedStrip(selectedStrip.stripId);
    } else if (selectedMix) {
      setSelectedStrip(selectedMix.stripId);
    }
  }, [savedStrips, savedMixes]);

  useEffect(() => {
    if (savedMixes && mixId) {
      const mixToConf = savedMixes.find(
        (mix) => mix.stripId.toString() === mixId
      );
      setMixToConfigure(mixToConf);
    }
  }, [mixId, savedMixes]);

  useEffect(() => {
    if (mixToConfigure && mixToConfigure.inputs) {
      const mixesArray = Object.keys(mixToConfigure.inputs.mixes);
      const stripsArray = Object.keys(mixToConfigure.inputs.strips);

      const mixesUsed = savedMixes.filter((mix) =>
        mixesArray.some((m) => {
          return parseInt(m) === mix.stripId;
        })
      );

      const stripsUsed = savedStrips.filter((strip) =>
        stripsArray.some((s) => {
          return parseInt(s) === strip.stripId;
        })
      );

      setUsedInputs([...mixesUsed, ...stripsUsed]);

      setMixesToPass(mixesUsed);
      setAudioStripsToPass(stripsUsed);
    }
  }, [mixToConfigure, savedMixes, savedStrips]);

  useEffect(() => {
    setAllInputs([...savedStrips, ...savedMixes]);
  }, [savedStrips, savedMixes]);

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

  const handleRemoveInputFromMix = (input: TAudioStrip | TMixStrip) => {
    if (mixId) {
      if (input.inputs == undefined) {
        removeStripFromMix(sendMessage, parseInt(mixId), input.stripId);
      } else {
        removeMixFromMix(sendMessage, parseInt(mixId), input.stripId);
      }
    }
  };

  const handleRemoveMix = () => {
    if (mixId) {
      removeMix(parseInt(mixId), sendMessage);
      navigate('/mixes', { replace: true });
    }
  };

  const handleSelection = (stripId: number | null) => {
    setSelectedStrip(stripId);

    setSavedMixes((prevMixes) =>
      prevMixes.map((mix) => ({
        ...mix,
        selected: stripId === mix.stripId || false
      }))
    );

    setSavedStrips((prevStrips) =>
      prevStrips.map((strip) => ({
        ...strip,
        selected: stripId === strip.stripId || false
      }))
    );
  };

  return (
    <div className="text-white text-2xl flex flex-col w-full overflow-hidden">
      <PageHeader
        title="Configure Mix:"
        titleElement={
          <Select
            value={
              mixToConfigure?.label || mixToConfigure?.stripId.toString() || ''
            }
            options={savedMixes}
          />
        }
      >
        <InputDropdown
          selectedInputs={usedInputs}
          options={allInputs}
          label="Add input to mix"
          mixToConfigure={mixToConfigure?.stripId}
          addInput={handleAddInput}
          removeInput={handleRemoveInputFromMix}
        />
      </PageHeader>

      <div className="flex flex-row space-x-8 mt-8 ml-8 items-center">
        {mixToConfigure && (
          <MixStrip
            key={`mix-${mixToConfigure.stripId}`}
            {...mixToConfigure}
            onStripSelect={handleSelection}
            onRemove={handleRemoveMix}
            isBeingConfigured={true}
          />
        )}
        {/* Inputs that belong to the conf-mix */}
        <div className="text-white text-2xl flex flex-row justify-between w-full">
          <div className="ml-8 w-full max-w-full overflow-hidden">
            <ScrollableContainer
              mixStrips={mixesToPass}
              audioStrips={audioStripsToPass}
              isRemovingFromMix={true}
              onStripSelect={handleSelection}
              handleRemoveStripFromMix={handleRemoveInputFromMix}
            />
          </div>

          {selectedStrip !== null && (
            <EffectsPanel
              strip={allInputs.find((strip) => strip.stripId === selectedStrip)}
            />
          )}
        </div>

        <ConfirmationModal
          isOpen={isModalOpen}
          title="Remove mix"
          message={`Are you sure you want to remove mix ${mixToConfigure?.label || mixToConfigure?.stripId.toString()}?`}
          confirmText="Yes, remove mix"
          onConfirm={handleRemoveMix}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};
