import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import { ScrollableContainer } from '../../components/scrollableContainer/ScrollableContainer';
import { EffectsPanel } from '../../components/strips/audioFilters/EffectsPanel';
import {
  DeleteButton,
  PrimaryButton
} from '../../components/ui/buttons/Buttons';
import { ConfirmationModal } from '../../components/ui/modals/confirmationModal/ConfirmationModal';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { useData } from '../../hooks/useData';
import { useNextAvailableIndex } from '../../hooks/useNextAvailableIndex';
import { addMix, removeMix } from '../../utils/utils';

export const MixesPage = () => {
  const [selectedMix, setSelectedMix] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteAllDisabled, setIsDeleteAllDisabled] = useState<boolean>(true);
  const { sendMessage } = useWebSocket();
  const { savedMixes, setSavedMixes } = useGlobalState();
  const nextMixIndex = useNextAvailableIndex(savedMixes);
  const navigate = useNavigate();
  useData();

  useEffect(() => {
    setIsDeleteAllDisabled(savedMixes.length === 0);
  }, [savedMixes]);

  useEffect(() => {
    const isSelected = savedMixes.find((mix) => {
      return mix.selected === true;
    })?.stripId;

    if (isSelected) {
      setSelectedMix(isSelected);
    }
  }, [savedMixes]);

  const handleAddMix = () => {
    addMix(sendMessage, nextMixIndex);
    navigate(`/mixes/${nextMixIndex}`);
  };

  const handleRemoveMix = (mixId: number) => {
    removeMix(mixId, sendMessage);

    if (selectedMix === mixId) {
      setSelectedMix(null);
    }

    setIsModalOpen(!isModalOpen);

    if (selectedMix === mixId) {
      setSelectedMix(null);
    }
  };

  const handleRemoveAllMixes = () => {
    savedMixes.forEach((mix) => handleRemoveMix(mix.stripId));
  };

  const onModalOpen = () => {
    if (isDeleteAllDisabled) {
      return;
    }

    setIsModalOpen(!isModalOpen);
  };

  const handleMixSelection = (mixId: number | null) => {
    setSelectedMix(mixId);

    setSavedMixes((prevMixes) =>
      prevMixes.map((mix) => ({
        ...mix,
        selected: mix.stripId === mixId || false
      }))
    );
  };

  return (
    <div className="text-white text-2xl flex flex-col w-full overflow-hidden">
      <PageHeader title="Audio Mixes">
        <div className="space-x-4">
          <DeleteButton disabled={isDeleteAllDisabled} onClick={onModalOpen}>
            Delete all mixes
          </DeleteButton>
          <PrimaryButton onClick={handleAddMix}>Add Mix</PrimaryButton>
        </div>
      </PageHeader>
      {/* Audio Strips Container */}
      <div className="text-white text-2xl flex flex-row justify-between w-full">
        <div className="ml-8 mt-4 w-full max-w-full overflow-hidden">
          <ScrollableContainer
            mixStrips={savedMixes}
            handleRemoveStrip={handleRemoveMix}
            onStripSelect={handleMixSelection}
          />
        </div>

        {/* Effects Panel */}
        {selectedMix !== null && (
          <div className="mt-4">
            <EffectsPanel
              strip={savedMixes.find((m) => m.stripId === selectedMix)}
            />
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete all mixes"
        message="Are you sure you want to delete all mixes?"
        confirmText="Yes, delete all"
        onConfirm={handleRemoveAllMixes}
      />
    </div>
  );
};
