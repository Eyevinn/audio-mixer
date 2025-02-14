import React from 'react';
import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import { MixStrip } from '../../components/strips/mixStrip/MixStrip';
import { useGlobalState } from '../../context/GlobalStateContext';

export const MixesPage = () => {
  const { savedStrips, setSavedStrips } = useGlobalState();

  const handleRemoveStrip = (stripId: number) => {
    console.log('remove strip', stripId);
    console.log('savedStrips', setSavedStrips);
  };

  const handleStripSelection = (stripId: number) => {
    console.log('handleStripSelection called with stripId:', stripId);
    // setSelectedStrip(stripId);
  };

  return (
    <div className="text-white text-2xl flex flex-col w-full">
      <PageHeader title="Audio Mixes">
        <button
          // TODO add onClick handler
          // onClick={handleAddStrip}
          className="p-2 bg-green-600 rounded hover:bg-green-700"
        >
          Add Mix
        </button>
      </PageHeader>
      <div className="overflow-x-auto w-[97%] flex space-x-4 cursor-grab active:cursor-grabbing select-none">
        {savedStrips.map((strip) => (
          <MixStrip
            key={strip.stripId}
            {...strip}
            // onSelect={() => {
            //   // setSelectedStrip(selectedStrip !== strip.id ? strip.id : null);
            // }}
            onStripSelect={handleStripSelection}
            onRemove={() => handleRemoveStrip(strip.stripId)}
          />
        ))}
      </div>
    </div>
  );
};
