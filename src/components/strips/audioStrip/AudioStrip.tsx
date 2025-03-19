import React from 'react';
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
  const warningTexts = useCheckOutputUsage(props, 'strip');

  const handleSelection = () => {
    props.onStripSelect(props.selected ? null : props.stripId, 'strips');
  };

  return (
    <BaseStrip
      {...props}
      backgroundColor="bg-strip-bg"
      header={`Strip #${props.stripId}`}
      isRemovingFromMix={props.isRemovingFromMix}
      isPFLInactive={props.isPFLInactive}
      handleSelection={handleSelection}
      removingOutputWarning={warningTexts}
    >
      <StripFields
        slot={
          props.input?.input_slot !== undefined
            ? props.input?.input_slot.toString()
            : ''
        }
        isStereo={props.input?.is_stereo}
        channel1={props.input?.first_channel}
        channel2={props.input?.second_channel}
        stripId={props.stripId}
        msStereoProps={{
          enabled: props.filters?.mid_side?.enabled ?? false,
          input_format: props.filters?.mid_side?.input_format ?? 'ms_stereo'
        }}
      />
    </BaseStrip>
  );
};
