import React from 'react';
import { BaseStrip } from '../BaseStrip';
import { StripFields } from './StripFields';
import { useWebSocket } from '../../../context/WebSocketContext';
import { useGlobalState } from '../../../context/GlobalStateContext';

interface AudioStripProps {
  id: number;
  label: string;
  selected: boolean;
  slot: number;
  channel1: number;
  channel2: number;
  mode: 'mono' | 'stereo';
  panning: number;
  muted: boolean;
  pfl: boolean;
  volume: number;
  onSelect: () => void;
  onRemove: () => void;
}

export const AudioStrip: React.FC<AudioStripProps> = (props) => {
  const { sendMessage } = useWebSocket();
  const { savedStrips, setSavedStrips } = useGlobalState();

  const handleStripChange = (
    stripId: number,
    property: string,
    value: number | boolean | string | undefined
  ) => {
    setSavedStrips(
      savedStrips.map((strip) =>
        strip.id === stripId ? { ...strip, [property]: value } : strip
      )
    );

    if (!value) return;
    if (property === 'selected') return;

    if (property === 'label') {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}`,
        body: { [property]: value }
      });
    } else {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/input`,
        body: { value }
      });
    }
  };

  return (
    <BaseStrip
      {...props}
      backgroundColor="bg-strip-bg"
      header={`Strip #${props.slot}`}
      handleStripChange={handleStripChange}
    >
      <StripFields
        slot={props.slot.toString()}
        mode={props.mode}
        channel1={props.channel1.toString()}
        channel2={props.channel2.toString()}
        stripId={props.id}
        handleStripChange={handleStripChange}
      />
    </BaseStrip>
  );
};
