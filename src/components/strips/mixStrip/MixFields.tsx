import Icons from '../../../assets/icons/Icons';

type TMixFieldsProps = {
  slot: string;
  mode: string;
  channel1: string;
  channel2: string;
  stripId: number;
  handleStripChange: (
    stripId: number,
    key: string,
    value: string | number
  ) => void;
};

export const MixFields = ({ stripId, handleStripChange }: TMixFieldsProps) => {
  return (
    <div
      className="w-full px-4 items-center"
      // onClick={() => handleStripChange(stripId, 'mode', 'stereo')}
    >
      <button
        type="button"
        className="flex w-full px-4 gap-1 items-center bg-input-field text-black outline-none text-center py-1 text-sm rounded mb-2"
        onClick={() => handleStripChange(stripId, 'mode', 'stereo')}
      >
        <Icons name="IconSettings" className="w-6 h-6" />
        Configure
      </button>
    </div>
  );
};
