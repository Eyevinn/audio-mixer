import React, { useEffect, useState } from 'react';
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

import { useNextAvailableIndex } from '../../hooks/useNextAvailableIndex';
import { useData } from '../../hooks/useData';

export const StripsPage = () => {
  const [selectedStrip, setSelectedStrip] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteAllDisabled, setIsDeleteAllDisabled] = useState<boolean>(true);
  const { sendMessage } = useWebSocket();
  const { savedStrips, setSavedStrips } = useGlobalState();
  const nextStripIndex = useNextAvailableIndex(savedStrips);
  useData();

  useEffect(() => {
    setIsDeleteAllDisabled(savedStrips.length === 0);
  }, [savedStrips]);

  useEffect(() => {
    const isSelected = savedStrips.find((strip) => {
      return strip.selected === true;
    })?.stripId;

    if (isSelected) {
      setSelectedStrip(isSelected);
    }
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
            handleRemoveStrip={handleRemoveStrip}
            onStripSelect={handleStripSelection}
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
