import { useEffect, useState } from 'react';
import { Strip } from '../../types/types';
import { addStrip, removeStrip } from '../../utils/utils';
import { useWebSocket } from '../../context/WebSocketContext';
import { EffectsPanel } from '../../components/strips/audioFilters/EffectsPanel';
import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import {
  PrimaryButton,
  DeleteButton
} from '../../components/ui/buttons/Buttons';
import { ConfirmationModal } from '../../components/ui/modals/confirmationModal/ConfirmationModal';
import { ScrollableContainer } from '../../components/scrollableContainer/ScrollableContainer';

export const StripsPage = () => {
  const [localStrips, setLocalStrips] = useState<Strip[]>([]);
  const [selectedStrip, setSelectedStrip] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteAllDisabled, setIsDeleteAllDisabled] = useState<boolean>(true);
  const { sendMessage, isConnected, lastMessage } = useWebSocket();
  // TODO: Add back when types are updated
  // const nextStripIndex = useNextAvailableIndex(strips);

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const data = JSON.parse(lastMessage);

      switch (data.type) {
        case 'response':
          if (data.resource === '/audio' && data.body?.strips) {
            setLocalStrips(data.body.strips);
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
      sendMessage({
        type: 'subscribe',
        resource: '/audio'
      });
    }
  }, [isConnected, sendMessage]);

  useEffect(() => {
    setIsDeleteAllDisabled(localStrips.length === 0);
  }, [localStrips]);

  // Create a default strip object
  const createDefaultStrip = (id: number): Strip => ({
    id,
    label: `Strip ${id}`,
    volume: 0,
    panning: 0,
    muted: false,
    pfl: false,
    slot: localStrips.length,
    channel1: 0,
    channel2: 1,
    mode: 'stereo',
    selected: false
  });

  const handleAddStrip = () => {
    const id = localStrips.length;
    const newStrip = createDefaultStrip(id);
    setLocalStrips([...localStrips, newStrip]);

    addStrip(sendMessage, localStrips.length + 1);
  };

  // TODO: Should use index instead
  const handleRemoveStrip = (stripId: number) => {
    removeStrip(stripId, sendMessage);
    setLocalStrips((prev) => prev.filter((strip) => strip.id !== stripId));
    if (selectedStrip === stripId) {
      setSelectedStrip(null);
    }
  };

  const handleRemoveAllStrips = () => {
    localStrips.forEach((strip) => handleRemoveStrip(strip.id));
    setSelectedStrip(null);
    setLocalStrips([]);
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
            strips={localStrips}
            selectedStrip={selectedStrip}
            setLocalStrips={setLocalStrips}
            setSelectedStrip={setSelectedStrip}
            handleRemoveStrip={handleRemoveStrip}
          />
        </div>

        {/* Effects Panel */}
        {selectedStrip !== null && (
          <EffectsPanel
            label={localStrips.find((s) => s.id === selectedStrip)?.label || ''}
            stripId={selectedStrip}
          />
        )}
      </div>
    </div>
  );
};
