import React from 'react';
import { StripDropdown } from '../../ui/dropdown/Dropdown';
import { StripInput } from '../../ui/input/Input';

type TStripFieldsProps = {
  slot: string;
  isStereo: boolean;
  channel1: number;
  channel2: number;
  stripId: number;
  handleStripChange: (
    stripId: number,
    key: string,
    value: string | number
  ) => void;
};

export const StripFields = ({
  slot,
  mode,
  channel1,
  channel2,
  stripId,
  handleStripChange
}: TStripFieldsProps) => {
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
        value={isStereo ? 'stereo' : 'mono'}
        onChange={(mode) =>
          handleStripChange(stripId, 'is_stereo', mode === 'stereo')
        }
      />

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
        hidden={mode === 'mono'}
      />
    </div>
  );
};
