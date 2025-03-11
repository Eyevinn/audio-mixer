import { StripDropdown } from '../../ui/dropdown/Dropdown';
import { StripInput } from '../../ui/input/Input';
import { MSStereo } from '../stripComponents/msStereo/MSStereo';

type TStripFieldsProps = {
  slot: string;
  isStereo: boolean;
  channel1: number;
  channel2: number;
  stripId: number;
  msStereoProps: {
    enabled: boolean;
    input_format: string;
  };
  handleStripChange: (
    stripId: number,
    key: string,
    value: string | number | boolean
  ) => void;
};

export const StripFields = ({
  slot,
  isStereo,
  channel1,
  channel2,
  stripId,
  msStereoProps,
  handleStripChange
}: TStripFieldsProps) => {
  return (
    <div className="flex flex-col pb-1">
      {/* Slot Input */}
      <StripInput
        type="Slot"
        value={slot !== undefined ? slot.toString() : ''}
        onChange={(slot: string) =>
          handleStripChange(
            stripId,
            'input_slot',
            slot !== '' ? parseInt(slot, 10) : ''
          )
        }
      />

      {/* Mode Select */}
      <StripDropdown
        type="Mode"
        options={['Mono', 'Stereo']}
        value={isStereo ? 'stereo' : 'mono'}
        onChange={(mode) =>
          handleStripChange(stripId, 'is_stereo', mode === 'stereo')
        }
      />

      {/* MS Stereo Select */}
      <MSStereo isStereo={isStereo} filters={msStereoProps} stripId={stripId} />

      {/* Left Ch Select */}
      <StripDropdown
        type="Left Ch"
        options={['0', '1']}
        value={channel1 !== undefined ? channel1.toString() : ''}
        onChange={(channel1) =>
          handleStripChange(stripId, 'first_channel', parseInt(channel1, 10))
        }
      />

      {/* Right Ch Select */}
      <StripDropdown
        type="Right Ch"
        options={['0', '1']}
        value={channel2 !== undefined ? channel2.toString() : ''}
        onChange={(channel2) =>
          handleStripChange(stripId, 'second_channel', parseInt(channel2, 10))
        }
        hidden={!isStereo}
      />
    </div>
  );
};
