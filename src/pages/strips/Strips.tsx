import { useEffect, useState } from 'react';
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
import { useNextAvailableIndex } from '../../hooks/useNextAvailableIndex';
import { addStrip, removeStrip } from '../../utils/utils';
import PageContainer from '../../components/pageLayout/pageContainer/PageContainer';

export const StripsPage = () => {
  const [selectedStrip, setSelectedStrip] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteAllDisabled, setIsDeleteAllDisabled] = useState<boolean>(true);
  const { sendMessage } = useWebSocket();
  const { savedStrips, setSavedStrips } = useGlobalState();
  const nextStripIndex = useNextAvailableIndex(savedStrips);
  const [isFirstMount, setIsFirstMount] = useState(true);
  useEffect(() => {
    setIsDeleteAllDisabled(savedStrips.length === 0);
  }, [savedStrips]);

  useEffect(() => {
    if (isFirstMount) return;

    const isSelected = savedStrips.find((strip) => {
      return strip.selected === true;
    })?.stripId;

    if (isSelected) {
      setSelectedStrip(isSelected);
    }
  }, [savedStrips, isFirstMount]);

  useEffect(() => {
    if (!isFirstMount) return;

    setSavedStrips((prevStrips) =>
      prevStrips.map((strip) => ({
        ...strip,
        selected: false
      }))
    );
    setSelectedStrip(null);
    setIsFirstMount(false);
  }, [isFirstMount, setSavedStrips]);

  const handleAddStrip = () => {
    addStrip(sendMessage, nextStripIndex);
  };

  const handleRemoveStrip = (stripId: number) => {
    removeStrip(stripId, sendMessage);

    if (selectedStrip === stripId) {
      setSelectedStrip(null);
    }
  };

  const handleRemoveAllStrips = () => {
    savedStrips.forEach((strip) => handleRemoveStrip(strip.stripId));
  };

  const onModalOpen = () => {
    if (isDeleteAllDisabled) {
      return;
    }

    setIsModalOpen(!isModalOpen);
  };

  const handleStripSelection = (stripId: number | null) => {
    setSelectedStrip(stripId);
    setSavedStrips((prevStrips) =>
      prevStrips.map((strip) => ({
        ...strip,
        selected: strip.stripId === stripId || false
      }))
    );
  };

  return (
    <PageContainer>
      <PageHeader title="Audio Strips">
        <div className="space-x-4">
          <DeleteButton disabled={isDeleteAllDisabled} onClick={onModalOpen}>
            Delete all strips
          </DeleteButton>
          <PrimaryButton onClick={handleAddStrip}>Add Strip</PrimaryButton>
        </div>
        <ConfirmationModal
          title="Delete all strips"
          message="Are you sure you want to delete all strips?"
          isOpen={isModalOpen}
          confirmText="Yes, delete all"
          onConfirm={() => handleRemoveAllStrips()}
          onClose={() => setIsModalOpen(false)}
        />
      </PageHeader>

      <div className="text-white text-2xl flex flex-row justify-between w-full">
        {/* Audio Strips Container */}
        <div className="ml-8 mt-4 w-full max-w-full overflow-hidden">
          <ScrollableContainer
            audioStrips={savedStrips}
            handleRemoveStrip={handleRemoveStrip}
            onStripSelect={handleStripSelection}
          />
        </div>

        {/* Effects Panel */}
        {selectedStrip !== null && (
          <EffectsPanel
            strip={savedStrips.find((s) => s.stripId === selectedStrip)}
            type="strips"
          />
        )}
      </div>
    </PageContainer>
  );
};
