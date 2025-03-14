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

export const StripFields = ({
  slot,
  isStereo,
  channel1,
  channel2,
  stripId,
  msStereoProps
}: TStripFieldsProps) => {
  const { handleChange } = useHandleChange();

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
        type="Left Ch"
        options={['0', '1']}
        value={channel1 !== undefined ? channel1.toString() : ''}
        onChange={(channel1) =>
          handleChange(
            'strips',
            stripId,
            'first_channel',
            parseInt(channel1, 10)
          )
        }
      />

      {/* Right Ch Select */}
      <StripDropdown
        type="Right Ch"
        options={['0', '1']}
        value={channel2 !== undefined ? channel2.toString() : ''}
        onChange={(channel2) =>
          handleChange(
            'strips',
            stripId,
            'second_channel',
            parseInt(channel2, 10)
          )
        }
        hidden={!isStereo}
      />
    </div>
  );
};
