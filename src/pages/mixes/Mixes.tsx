import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import { MixStrip } from '../../components/strips/mixStrip/MixStrip';
import { useGlobalState } from '../../context/GlobalStateContext';
import { addMix, removeMix } from '../../utils/utils';
import { useWebSocket } from '../../context/WebSocketContext';
import { useNextAvailableIndex } from '../../hooks/useNextAvailableIndex';
import { useData } from '../../hooks/useData';
import { EffectsPanel } from '../../components/strips/audioFilters/EffectsPanel';

export const MixesPage = () => {
  const [selectedMix, setSelectedMix] = useState<number | null>(null);
  const { sendMessage } = useWebSocket();
  const { savedMixes, setSavedMixes } = useGlobalState();
  const nextMixIndex = useNextAvailableIndex(savedMixes);
  useData();

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
  };

  const handleRemoveMix = (stripId: number) => {
    removeMix(stripId, sendMessage);
    if (selectedMix === stripId) {
      setSelectedMix(null);
    }
  };

  const handleMixSelection = (stripId: number | null) => {
    setSelectedMix(stripId);

    setSavedMixes((prevStrips) =>
      prevStrips.map((strip) => ({
        ...strip,
        selected: strip.stripId === stripId || false
      }))
    );
  };

  return (
    <div className="text-white text-2xl flex flex-col w-full">
      <PageHeader title="Audio Mixes">
        <button
          onClick={handleAddMix}
          className="p-2 bg-green-600 rounded hover:bg-green-700"
        >
          Add Mix
        </button>
      </PageHeader>
      <div className="overflow-x-auto w-[97%] flex space-x-4 cursor-grab active:cursor-grabbing select-none">
        {savedMixes.map((mix) => (
          <MixStrip
            key={mix.stripId}
            {...mix}
            onStripSelect={handleMixSelection}
            onRemove={() => handleRemoveMix(mix.stripId)}
          />
        ))}
        {/* Effects Panel */}
        {selectedMix !== null && (
          <EffectsPanel
            strip={savedMixes.find((m) => m.stripId === selectedMix)}
          />
        )}
      </div>
    </div>
  );
};
