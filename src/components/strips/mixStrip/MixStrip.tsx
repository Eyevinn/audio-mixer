import React from 'react';
import { BaseStrip } from '../BaseStrip';
import { MixFields } from './MixFields';
import { TMixStrip } from '../../../types/types';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { useWebSocket } from '../../../context/WebSocketContext';

interface MixStripProps extends TMixStrip {
  onStripSelect: (stripId: number | null) => void;
  onRemove: () => void;
}

export const MixStrip: React.FC<MixStripProps> = (props) => {
  const { sendMessage } = useWebSocket();
  const { savedMixes, setSavedMixes } = useGlobalState();

  const handleSelection = () => {
    props.onStripSelect(props.selected ? null : props.stripId);
  };

  const handleMixChange = (
    stripId: number,
    property: string,
    value: number | boolean | string | undefined
  ) => {
    setSavedMixes(
      savedMixes.map((mix) =>
        mix.stripId === stripId ? { ...mix, [property]: value } : mix
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
        resource: `/audio/mixes/${stripId}`,
        body: { [property]: value }
      });
    } else if (property === 'volume' || property === 'muted') {
      sendMessage({
        type: 'set',
        resource: `/audio/mixes/${stripId}/fader`,
        body: { [property]: value }
      });
    } else if (property === 'panning') {
      sendMessage({
        type: 'set',
        resource: `/audio/mixes/${stripId}/filters/pan`,
        body: { value: value }
      });
    }
  };

  return (
    <BaseStrip
      {...props}
      backgroundColor="bg-mix-bg"
      header={`Mix #${props.stripId}`}
      copyButton={true}
      handleStripChange={handleMixChange}
      handleSelection={handleSelection}
    >
      <MixFields stripId={props.stripId} />
    </BaseStrip>
  );
};
