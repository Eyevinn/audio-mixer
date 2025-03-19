import { useEffect, useState } from 'react';
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
  const [inputSlot, setInputSlot] = useState<string>('');
  const [firstChannel, setFirstChannel] = useState<string>('');
  const [secondChannel, setSecondChannel] = useState<string>('');

  useEffect(() => {
    setInputSlot(slot);
  }, [slot]);

  useEffect(() => {
    setFirstChannel(channel1 !== undefined ? (channel1 + 1).toString() : '');
  }, [channel1]);

  useEffect(() => {
    setSecondChannel(channel2 !== undefined ? (channel2 + 1).toString() : '');
  }, [channel2]);

  const handleInputSlotChange = (val: string) => {
    if (Number(val) >= 0) {
      setInputSlot(val);
      handleChange(
        'strips',
        stripId,
        'input_slot',
        val !== '' ? parseInt(val, 10) : ''
      );
    }
  };

  const handleFirstChannelChange = (val: string) => {
    setFirstChannel(val);
    handleChange('strips', stripId, 'first_channel', parseInt(val, 10) - 1);
  };

  const handleSecondChannelChange = (val: string) => {
    setSecondChannel(val);
    handleChange('strips', stripId, 'second_channel', parseInt(val, 10) - 1);
  };

  const renderChannelLabel = (
    mode: 'stereo' | 'mono' | 'ms-stereo',
    channel: 'first' | 'second'
  ) => {
    if (mode === 'stereo') {
      return channel === 'first' ? 'Left Ch' : 'Right Ch';
    } else if (mode === 'ms-stereo') {
      return channel === 'first' ? 'Mid Ch' : 'Side Ch';
    } else {
      return 'Mono Ch';
    }
  };

  return (
    <div className="flex flex-col pb-1">
      {/* Slot Input */}
      <StripInput
        type="Slot"
        value={inputSlot}
        onChange={handleInputSlotChange}
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
        value={firstChannel}
        onChange={handleFirstChannelChange}
      />

      {/* Right Ch Select */}
      <StripDropdown
        type={renderChannelLabel(
          isStereo ? (msStereoProps.enabled ? 'ms-stereo' : 'stereo') : 'mono',
          'second'
        )}
        options={channelOptions}
        value={secondChannel}
        onChange={handleSecondChannelChange}
        disabled={!isStereo}
        hidden={!isStereo}
      />
    </div>
  );
};
