import React from 'react';
import { BaseStrip } from '../BaseStrip';
import { MixFields } from './MixFields';

interface MixStripProps {
  id: number;
  label: string;
  selected: boolean;
  panning: number;
  muted: boolean;
  pfl: boolean;
  volume: number;
  mode: 'mono' | 'stereo';
  slot: number;
  channel1: number;
  channel2: number;
  onSelect: () => void;
  onRemove: () => void;
}

export const MixStrip: React.FC<MixStripProps> = (props) => {
  const mix = 1;

  const handleStripChange = () => {
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
    >
      <MixFields
        stripId={props.id}
        handleStripChange={handleStripChange}
        slot={props.slot.toString()}
        mode={props.mode}
        channel1={props.channel1.toString()}
        channel2={props.channel2.toString()}
      />
    </BaseStrip>
  );
};
