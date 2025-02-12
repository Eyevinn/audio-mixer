import { StripDropdown } from '../../ui/dropdown/Dropdown';
import { StripInput } from '../../ui/input/Input';

type TInputFieldsProps = {
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

export const InputFields = ({
  slot,
  mode,
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
            'slot',
            slot !== '' ? parseInt(slot, 10) : ''
          )
        }
      />

      {/* Mode Select */}
      <StripDropdown
        type="Mode"
        options={['Mono', 'Stereo']}
        value={mode}
        onChange={(mode: string) => handleStripChange(stripId, 'mode', mode)}
      />

      {/* Left Ch Select */}
      <StripDropdown
        type="Left Ch"
        options={['0', '1']}
        value={channel1.toString()}
        onChange={(channel1: string) =>
          handleStripChange(stripId, 'channel1', parseInt(channel1, 10))
        }
      />

      {/* Right Ch Select */}
      <StripDropdown
        type="Right Ch"
        options={['0', '1']}
        value={channel2.toString()}
        onChange={(channel2: string) =>
          handleStripChange(stripId, 'channel2', parseInt(channel2, 10))
        }
        hidden={mode === 'mono'}
      />
    </div>
  );
};
