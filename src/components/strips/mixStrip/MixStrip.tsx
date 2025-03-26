import React, { useEffect } from 'react';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { useWebSocket } from '../../../context/WebSocketContext';
import { useCheckOutputUsage } from '../../../hooks/useCheckOutputUsage';
import { useHandleChange } from '../../../hooks/useHandleChange';
import { useNextAvailableIndex } from '../../../hooks/useNextAvailableIndex';
import { TMixStrip } from '../../../types/types';
import { addMix, addMixToMix, addStripToMix } from '../../../utils/wsCommands';
import { BaseStrip } from '../BaseStrip';
import { MixFields } from './MixFields';

interface MixStripProps extends TMixStrip {
  isRemovingFromMix?: boolean;
  isBeingConfigured?: boolean;
  highlightedMixId?: number | null;
  isPFLInactive: boolean | undefined;
  onStripSelect: (stripId: number | null, type: 'mixes' | 'strips') => void;
  onRemove: () => void;
  setHighlightedMixId?: (stripId: number | null) => void;
}

export const MixStrip: React.FC<MixStripProps> = (props) => {
  const { sendMessage } = useWebSocket();
  const { mixes } = useGlobalState();
  const nextMixIndex = useNextAvailableIndex(mixes);
  const warningTexts = useCheckOutputUsage(props, 'mix');
  const { highlightedMixId, stripId, setHighlightedMixId } = props;
  const { handleChange } = useHandleChange();

  useEffect(() => {
    if (highlightedMixId === stripId) {
      const highlightTimeout = setTimeout(() => {
        if (setHighlightedMixId) {
          setHighlightedMixId(null);
        }
      }, 2000);

      return () => clearTimeout(highlightTimeout);
    }
  }, [highlightedMixId, stripId, setHighlightedMixId]);

  const handleCopyMix = (mixToCopy: number) => {
    const mixToCopyData = mixes.find((mix) => mix.stripId === mixToCopy);
    if (!mixToCopyData) return;

    // Create new mix
    addMix(sendMessage, nextMixIndex);

    if (props.setHighlightedMixId) {
      props.setHighlightedMixId(nextMixIndex);
    }

    // Change label of new mix
    const renderCopyLabel = `Copy of ${mixToCopyData.label || 'Mix ' + mixToCopyData.stripId}`;
    handleChange('mixes', nextMixIndex, 'label', renderCopyLabel);
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
      isPFLInactive={props.isPFLInactive}
      onCopy={() => handleCopyMix(props.stripId)}
      handleSelection={handleSelection}
      isBeingConfigured={props.isBeingConfigured}
      removingOutputWarning={warningTexts}
    >
      <MixFields
        isBeingConfigured={props.isBeingConfigured}
        stripId={props.stripId}
      />
    </BaseStrip>
  );
};
