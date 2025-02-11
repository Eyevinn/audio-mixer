import { useEffect, useState } from 'react';
import { Strip } from '../../types/types';
import { addStrip, removeStrip } from '../../utils/utils';
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

export const StripsPage = () => {
  const [selectedStrip, setSelectedStrip] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteAllDisabled, setIsDeleteAllDisabled] = useState<boolean>(true);
  const { sendMessage, isConnected, lastMessage } = useWebSocket();
  const { savedStrips, setSavedStrips } = useGlobalState();
  // TODO: Add back when types are updated
  // const nextStripIndex = useNextAvailableIndex(strips);

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const data = JSON.parse(lastMessage);
      switch (data.type) {
        case 'get-response':
          console.log('GET RESPONSE');
          if (data.resource === '/audio/strips') {
            // TODO - Handle response and update state
            // setSavedStrips(data.body);
            console.log('Strips: ', data.body);
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
      // ToDo: Fix endpoint
      sendMessage({
        type: 'subscribe',
        resource: '/audio/strips'
      });
    }
  }, [isConnected, sendMessage]);

  useEffect(() => {
    setSavedStrips(
      savedStrips.map((strip) =>
        strip.id !== selectedStrip
          ? { ...strip, selected: false }
          : { ...strip, selected: true }
      )
    );
  }, [selectedStrip]);

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
    slot: 0,
    channel1: 0,
    channel2: 1,
    mode: 'stereo',
    selected: false
  });

  const handleAddStrip = () => {
    const id = savedStrips.length;
    const newStrip = createDefaultStrip(id);

    setSavedStrips([...savedStrips, newStrip]);

    // ToDo: Fix index that now is length of all strips
    addStrip(sendMessage, id);
  };

  // TODO: Should use index instead
  const handleRemoveStrip = (stripId: number) => {
    removeStrip(stripId, sendMessage);

    const filteredStrips = savedStrips.filter((strip) => strip.id !== stripId);
    setSavedStrips(filteredStrips);
    if (selectedStrip === stripId) {
      setSelectedStrip(null);
    }
  };

  useEffect(() => {
    console.log('Selected strip: ', selectedStrip);
  }, [selectedStrip]);

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
            label={savedStrips.find((s) => s.id === selectedStrip)?.label || ''}
            stripId={selectedStrip}
          />
        )}
      </div>
    </div>
  );
};
