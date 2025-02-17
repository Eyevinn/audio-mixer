import { StripDropdown } from '../../ui/dropdown/Dropdown';
import { StripInput } from '../../ui/input/Input';

type TInputFieldsProps = {
  slot: string;
  isStereo: boolean;
  channel1: string;
  channel2: string;
  stripId: number;
  handleStripChange: (
    stripId: number,
    key: string,
    value: string | number | boolean
  ) => void;
};

export const InputFields = ({
  slot,
  isStereo,
  channel1,
  channel2,
  stripId,
  handleStripChange
}: TInputFieldsProps) => {
  return (
    <div className="flex flex-col">
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
        onChange={(mode: string) =>
          handleStripChange(stripId, 'is_stereo', mode === 'stereo')
        }
      />

      {/* Left Ch Select */}
      <StripDropdown
        type="Left Ch"
        options={['0', '1']}
        value={channel1.toString()}
        onChange={(channel1: string) =>
          handleStripChange(stripId, 'first_channel', parseInt(channel1, 10))
        }
      />

      {/* Right Ch Select */}
      <StripDropdown
        type="Right Ch"
        options={['0', '1']}
        value={channel2.toString()}
        onChange={(channel2: string) =>
          handleStripChange(stripId, 'second_channel', parseInt(channel2, 10))
        }
        hidden={!isStereo}
      />
    </div>
  );
};
