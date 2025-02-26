import React, { useEffect } from 'react';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { useWebSocket } from '../../../context/WebSocketContext';
import { useNextAvailableIndex } from '../../../hooks/useNextAvailableIndex';
import { TMixStrip } from '../../../types/types';
import { addMix, addMixToMix, addStripToMix } from '../../../utils/utils';
import { BaseStrip } from '../BaseStrip';
import { MixFields } from './MixFields';

interface MixStripProps extends TMixStrip {
  isRemovingFromMix?: boolean;
  isBeingConfigured?: boolean;
  highlightedMixId?: number | null;
  onStripSelect: (stripId: number | null, type: 'mixes' | 'strips') => void;
  onRemove: () => void;
  setHighlightedMixId?: (stripId: number | null) => void;
}

export const MixStrip: React.FC<MixStripProps> = (props) => {
  const { sendMessage } = useWebSocket();
  const { savedMixes, setSavedMixes } = useGlobalState();
  const nextMixIndex = useNextAvailableIndex(savedMixes);

  useEffect(() => {
    let highlightTimeout: NodeJS.Timeout;
    if (props.highlightedMixId === props.stripId) {
      highlightTimeout = setTimeout(() => {
        if (props.setHighlightedMixId) {
          props.setHighlightedMixId(null);
        }
      }, 2000);
    }
    return () => clearTimeout(highlightTimeout);
  });

  const handleCopyMix = (mixToCopy: number) => {
    const mixToCopyData = savedMixes.find((mix) => mix.stripId === mixToCopy);
    if (!mixToCopyData) return;

    // Create new mix
    addMix(sendMessage, nextMixIndex);

    if (props.setHighlightedMixId) {
      props.setHighlightedMixId(nextMixIndex);
    }

    // Change label of new mix
    const renderCopyLabel = `Copy of ${mixToCopyData.label || 'Mix ' + mixToCopyData.stripId}`;
    handleMixChange(nextMixIndex, 'label', renderCopyLabel);

    // Add inputs to new mix
    Object.entries(mixToCopyData.inputs.mixes).forEach(([key]) => {
      addMixToMix(sendMessage, nextMixIndex, parseInt(key));
    });
    Object.entries(mixToCopyData.inputs.strips).forEach(([key]) => {
      addStripToMix(sendMessage, nextMixIndex, parseInt(key));
    });
  };

  const handleSelection = () => {
    props.onStripSelect(props.selected ? null : props.stripId, 'mixes');
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
      backgroundColor={
        props.isBeingConfigured ? 'bg-selected-mix-bg' : 'bg-mix-bg'
      }
      isHighlighted={props.highlightedMixId === props.stripId}
      header={`Mix #${props.stripId}`}
      copyButton={true}
      isRemovingFromMix={props.isRemovingFromMix}
      handleStripChange={handleMixChange}
      onCopy={() => handleCopyMix(props.stripId)}
      handleSelection={handleSelection}
      isBeingConfigured={props.isBeingConfigured}
    >
      <MixFields
        isBeingConfigured={props.isBeingConfigured}
        stripId={props.stripId}
      />
    </BaseStrip>
  );
};
