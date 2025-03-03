import { useEffect, useMemo, useState } from 'react';
import PageBody from '../../components/pageLayout/pageBody/pageBody';
import PageContainer from '../../components/pageLayout/pageContainer/PageContainer';
import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import { ScrollableContainer } from '../../components/scrollableContainer/ScrollableContainer';
import { EffectsPanel } from '../../components/strips/stripComponents/audioFilters/EffectsPanel';
import {
  DeleteButton,
  PrimaryButton
} from '../../components/ui/buttons/Buttons';
import { ConfirmationModal } from '../../components/ui/modals/confirmationModal/ConfirmationModal';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { useNextAvailableIndex } from '../../hooks/useNextAvailableIndex';
import { addStrip, removeStrip } from '../../utils/wsCommands';

export const StripsPage = () => {
  const [selectedStrip, setSelectedStrip] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteAllDisabled, setIsDeleteAllDisabled] = useState<boolean>(true);
  const { sendMessage } = useWebSocket();
  const { strips, mixes, setStrips } = useGlobalState();
  const nextStripIndex = useNextAvailableIndex(strips);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const isPFL = useMemo(() => mixes?.find((m) => m.stripId === 1000), [mixes]);

  useEffect(() => {
    setIsDeleteAllDisabled(strips.length === 0);
  }, [strips]);

  useEffect(() => {
    if (isFirstMount) return;

    const isSelected = strips.find((strip) => {
      return strip.selected === true;
    })?.stripId;

    if (isSelected) {
      setSelectedStrip(isSelected);
    }
  }, [strips, isFirstMount]);

  useEffect(() => {
    if (!isFirstMount) return;

    setStrips((prevStrips) =>
      prevStrips.map((strip) => ({
        ...strip,
        selected: false
      }))
    );
    setSelectedStrip(null);
    setIsFirstMount(false);
  }, [isFirstMount, setStrips]);

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
    strips.forEach((strip) => handleRemoveStrip(strip.stripId));
  };

  const onModalOpen = () => {
    if (isDeleteAllDisabled) {
      return;
    }

    setIsModalOpen(!isModalOpen);
  };

  const handleStripSelection = (stripId: number | null) => {
    setSelectedStrip(stripId);
    setStrips((prevStrips) =>
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
          <PrimaryButton onClick={handleAddStrip}>Create Strip</PrimaryButton>
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

      <PageBody>
        {/* Audio Strips Container */}
        <div className="p-4 w-full max-w-full overflow-hidden h-full">
          <ScrollableContainer
            audioStrips={strips}
            isPFL={isPFL}
            handleRemoveStrip={handleRemoveStrip}
            onStripSelect={handleStripSelection}
          />
        </div>

        {/* Effects Panel */}
        {selectedStrip !== null && (
          <div className="p-4">
            <EffectsPanel
              strip={strips.find((s) => s.stripId === selectedStrip)}
              type="strips"
            />
          </div>
        )}
      </PageBody>
    </PageContainer>
  );
};
