import React from 'react';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { useWebSocket } from '../../../context/WebSocketContext';
import { useCheckOutputUsage } from '../../../hooks/useCheckOutputUsage';
import { TAudioStrip } from '../../../types/types';
import { BaseStrip } from '../BaseStrip';
import { StripFields } from './StripFields';

interface AudioStripProps extends TAudioStrip {
  isRemovingFromMix?: boolean;
  isPFLInactive: boolean | undefined;
  onStripSelect: (stripId: number | null, type: 'mixes' | 'strips') => void;
  onRemove: () => void;
}

export const AudioStrip: React.FC<AudioStripProps> = (props) => {
  const { sendMessage } = useWebSocket();
  const { strips, setStrips } = useGlobalState();
  const warningTexts = useCheckOutputUsage(props, 'strip');

  const handleSelection = () => {
    props.onStripSelect(props.selected ? null : props.stripId, 'strips');
  };

  const handleChange = (
    stripId: number,
    property: string,
    value: number | boolean | string | undefined
  ) => {
    setStrips(
      strips.map((strip) =>
        strip.stripId === stripId ? { ...strip, [property]: value } : strip
      )
    );

    // If the value is undefined, do not send the message.
    // Needed for the input fields, so the input fields can be cleared
    if (value === undefined) return;

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
      header={`Strip #${props.stripId}`}
      isRemovingFromMix={props.isRemovingFromMix}
      isPFLInactive={props.isPFLInactive}
      handleStripChange={handleChange}
      handleSelection={handleSelection}
      removingOutputWarning={warningTexts}
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
