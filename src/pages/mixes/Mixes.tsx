import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import { useGlobalState } from '../../context/GlobalStateContext';
import { MixStrip } from '../../components/strips/mixStrip/MixStrip';

export const MixesPage = () => {
  const { savedStrips, setSavedStrips } = useGlobalState();

  const handleRemoveStrip = (stripId: number) => {
    console.log('remove strip', stripId);
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
            key={strip.id}
            {...strip}
            onSelect={() => {
              // setSelectedStrip(selectedStrip !== strip.id ? strip.id : null);
            }}
            onRemove={() => handleRemoveStrip(strip.id)}
          />
        ))}
      </div>
    </div>
  );
};
