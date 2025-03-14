import { useHandleChange } from '../../../hooks/useHandleChange';
import { StripDropdown } from '../../ui/dropdown/Dropdown';
import { StripInput } from '../../ui/input/Input';
import { ModeSelect } from '../stripComponents/msStereo/ModeSelect';

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
};

const channelOptions = Array.from({ length: 16 }, (_, i) => (i + 1).toString());

export const StripFields = ({
  slot,
  isStereo,
  channel1,
  channel2,
  stripId,
  msStereoProps
}: TStripFieldsProps) => {
  const { handleChange } = useHandleChange();

  const renderChannelLabel = (
    mode: 'stereo' | 'mono' | 'ms-stereo',
    channel: 'first' | 'second'
  ) => {
    if (mode === 'stereo') {
      return channel === 'first' ? 'Left Ch' : 'Right Ch';
    } else if (mode === 'ms-stereo') {
      return channel === 'first' ? 'Mid' : 'Side';
    } else {
      return 'Mono channel';
    }
  };

  return (
    <div className="flex flex-col pb-1">
      {/* Slot Input */}
      <StripInput
        type="Slot"
        value={slot !== undefined ? slot.toString() : ''}
        onChange={(slot: string) =>
          handleChange(
            'strips',
            stripId,
            'input_slot',
            slot !== '' ? parseInt(slot, 10) : ''
          )
        }
      />

      {/* Mode Select */}
      <ModeSelect
        isStereo={isStereo}
        filters={msStereoProps}
        stripId={stripId}
        handleChange={handleChange}
      />

      {/* Left Ch Select */}
      <StripDropdown
        type={renderChannelLabel(
          isStereo ? (msStereoProps.enabled ? 'ms-stereo' : 'stereo') : 'mono',
          'first'
        )}
        options={channelOptions}
        value={channel1 !== undefined ? (channel1 + 1).toString() : ''}
        onChange={(channel1) =>
          handleChange(
            'strips',
            stripId,
            'first_channel',
            parseInt(channel1, 10) - 1
          )
        }
      />

      {/* Right Ch Select */}
      <StripDropdown
        type={renderChannelLabel(
          isStereo ? (msStereoProps.enabled ? 'ms-stereo' : 'stereo') : 'mono',
          'second'
        )}
        options={channelOptions}
        value={channel2 !== undefined ? (channel2 + 1).toString() : ''}
        onChange={(channel2) =>
          handleChange(
            'strips',
            stripId,
            'second_channel',
            parseInt(channel2, 10) - 1
          )
        }
        disabled={!isStereo}
        hidden={!isStereo}
      />
    </div>
  );
};
