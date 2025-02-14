import React from 'react';
import { BaseStrip } from '../BaseStrip';
// import { useWebSocket } from '../../../context/WebSocketContext';
// import { useGlobalState } from '../../../context/GlobalStateContext';
import { MixFields } from './MixFields';
import { Filters } from '../../../types/types';

interface MixStripProps {
  stripId: number;
  label: string;
  selected: boolean;
  pfl: boolean;
  fader: {
    muted: boolean;
    volume: number;
  };
  filters: Filters;
  input: {
    first_channel: number;
    input_slot: number;
    is_stereo: boolean;
    second_channel: number;
  };
  input_meter: {
    peak?: number;
    peak_left?: number;
    peak_right?: number;
  };
  post_fader_meter: {
    peak_left: number;
    peak_right: number;
  };
  pre_fader_meter: {
    peak_left: number;
    peak_right: number;
  };
  onStripSelect: (stripId: number) => void;
  onRemove: () => void;
}

export const MixStrip: React.FC<MixStripProps> = (props) => {
  const mix = 1;

  const handleSelection = () => {
    props.onStripSelect(props.stripId);
  };

  const handleStripChange = (
    stripId: number,
    property: string,
    value: number | boolean | string | undefined
  ) => {
    console.log('handleStripChange', stripId, property, value);
    // Implement mix-specific handling logic here
    // ...
  };

  return (
    <BaseStrip
      {...props}
      backgroundColor="bg-mix-bg"
      header={`Mix #${mix}`}
      copyButton={true}
      handleStripChange={handleStripChange}
      handleSelection={handleSelection}
    >
      <MixFields
        stripId={props.stripId}
        handleStripChange={handleStripChange}
        slot={props.input.input_slot.toString()}
        mode={props.input.is_stereo ? 'stereo' : 'mono'}
        channel1={props.input.first_channel.toString()}
        channel2={props.input.second_channel.toString()}
      />
    </BaseStrip>
  );
};
