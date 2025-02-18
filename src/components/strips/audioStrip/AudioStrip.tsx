import React from 'react';
import { useWebSocket } from '../../../context/WebSocketContext';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { TAudioStrip } from '../../../types/types';
import { BaseStrip } from '../BaseStrip';
import { StripFields } from './StripFields';

interface AudioStripProps extends TAudioStrip {
  onStripSelect: (stripId: number | null) => void;
  onRemove: () => void;
}

export const AudioStrip: React.FC<AudioStripProps> = (props) => {
  const { sendMessage } = useWebSocket();
  const { savedStrips, setSavedStrips } = useGlobalState();

  const handleSelection = () => {
    props.onStripSelect(props.selected ? null : props.stripId);
  };

  const handleChange = (
    stripId: number,
    property: string,
    value: number | boolean | string | undefined
  ) => {
    setSavedStrips(
      savedStrips.map((strip) =>
        strip.stripId === stripId ? { ...strip, [property]: value } : strip
      )
    );

    // If the value is undefined, do not send the message.
    // Needed for the input fields, so the input fields can be cleared
    if (value === undefined) return;

    // Local states are not needed to be sent
    if (property === 'pfl') return;

    if (property === 'label') {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}`,
        body: { [property]: value }
      });
    } else if (
      property === 'input_slot' ||
      property === 'is_stereo' ||
      property === 'first_channel' ||
      property === 'second_channel'
    ) {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/input`,
        body: { [property]: value }
      });
    } else if (property === 'volume' || property === 'muted') {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/fader`,
        body: { [property]: value }
      });
    } else if (property === 'panning') {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/filters/pan`,
        body: { value: value }
      });
    }
  };

  return (
    <BaseStrip
      {...props}
      backgroundColor="bg-strip-bg"
      header={`Strip #${props.input.input_slot}`}
      handleStripChange={handleChange}
      handleSelection={handleSelection}
    >
      <StripFields
        slot={
          props.input.input_slot !== undefined
            ? props.input.input_slot.toString()
            : ''
        }
        isStereo={props.input.is_stereo}
        channel1={props.input.first_channel}
        channel2={props.input.second_channel}
        stripId={props.stripId}
        handleStripChange={handleChange}
      />
    </BaseStrip>
  );
};
