import { useEffect, useState } from 'react';
import { addStrip, getAllStrips, removeStrip } from '../../utils/utils';
import { useWebSocket } from '../../context/WebSocketContext';
import { EffectsPanel } from '../../components/strips/audioFilters/EffectsPanel';
import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import { useGlobalState } from '../../context/GlobalStateContext';
import {
  PrimaryButton,
  DeleteButton
} from '../../components/ui/buttons/Buttons';
import { ConfirmationModal } from '../../components/ui/modals/confirmationModal/ConfirmationModal';
import { ScrollableContainer } from '../../components/scrollableContainer/ScrollableContainer';
import { Strip } from '../../types/types';
import { useNextAvailableIndex } from '../../hooks/useNextAvailableIndex';

export const StripsPage = () => {
  const [selectedStrip, setSelectedStrip] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteAllDisabled, setIsDeleteAllDisabled] = useState<boolean>(true);
  const { sendMessage, isConnected, lastMessage } = useWebSocket();
  const { savedStrips, setSavedStrips } = useGlobalState();
  const nextStripIndex = useNextAvailableIndex(savedStrips);

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const data = JSON.parse(lastMessage);
      switch (data.type) {
        case 'get-response':
          if (data.resource === '/audio/strips') {
            const stripsArray = Object.entries(data.body).map(
              ([index, stripData]) => {
                const strip = stripData as Strip;
                // Find existing strip to preserve local states
                const existingStrip = savedStrips.find(
                  (s) => s.stripId === parseInt(index)
                );

                return {
                  // Preserve local states if they exist
                  selected: existingStrip?.selected ?? false,
                  pfl: existingStrip?.pfl ?? false,
                  stripId: parseInt(index),
                  // API data
                  fader: strip.fader,
                  filters: strip.filters,
                  input: strip.input,
                  input_meter: strip.input_meter,
                  label: strip.label,
                  post_fader_meter: strip.post_fader_meter,
                  pre_fader_meter: strip.pre_fader_meter
                };
              }
            );

            setSavedStrips(stripsArray);
          }
          break;

        case 'state-change':
          // ToDo: Implement state-change handling
          break;

        case 'sampling-update':
          // ToDo: Implement sampling-update handling
          break;
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [lastMessage, selectedStrip]);

  useEffect(() => {
    if (isConnected) {
      getAllStrips(sendMessage);
    }
  }, [isConnected, sendMessage]);

  useEffect(() => {
    setSavedStrips(
      savedStrips.map((strip) =>
        strip.stripId !== selectedStrip
          ? { ...strip, selected: false }
          : { ...strip, selected: true }
      )
    );
  }, [selectedStrip]);

  useEffect(() => {
    setIsDeleteAllDisabled(savedStrips.length === 0);
  }, [savedStrips]);

  const handleAddStrip = () => {
    addStrip(sendMessage, nextStripIndex);
  };

  const handleRemoveStrip = (stripId: number) => {
    removeStrip(stripId, sendMessage);

    const filteredStrips = savedStrips.filter(
      (strip) => strip.stripId !== stripId
    );
    setSavedStrips(filteredStrips);
    if (selectedStrip === stripId) {
      setSelectedStrip(null);
    }
  };

  const handleRemoveAllStrips = () => {
    savedStrips.forEach((strip) => handleRemoveStrip(strip.stripId));
    setSelectedStrip(null);
    setSavedStrips([]);
  };

  const onModalOpen = () => {
    if (isDeleteAllDisabled) {
      return;
    }

    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="text-white text-2xl flex flex-col w-full overflow-hidden">
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
            selectedStrip={selectedStrip}
            setSelectedStrip={setSelectedStrip}
            handleRemoveStrip={handleRemoveStrip}
          />
        </div>

        {/* Effects Panel */}
        {selectedStrip !== null && (
          <EffectsPanel
            strip={savedStrips.find((s) => s.stripId === selectedStrip)}
          />
        )}
      </div>
    </div>
  );
};
