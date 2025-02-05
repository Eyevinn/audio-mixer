import { PageHeader } from '../../components/pageHeader/PageHeader';

export const MixesPage = () => {
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
    </div>
  );
};
