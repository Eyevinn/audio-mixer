import React from 'react';
import { BaseStrip } from '../../BaseStrip';
import { useGlobalState } from '../../../../context/GlobalStateContext';

interface MixStripProps {
  stripId: number;
  configId: number;
  sendLevels: {
    muted: boolean;
    volume: number;
    origin: 'pre_fader' | 'post_fader';
  };
  type: 'mixes' | 'strips';
  isPFLInactive: boolean | undefined;
  onStripSelect: (stripId: number | null, type: 'mixes' | 'strips') => void;
  onRemove: () => void;
}

export const ConfigureMixStrip: React.FC<MixStripProps> = ({
  stripId,
  configId,
  sendLevels,
  type,
  isPFLInactive,
  onStripSelect,
  onRemove
}) => {
  const { mixes, strips } = useGlobalState();

  const originMix = mixes.find(
    (mix) => mix.stripId === configId && type === 'mixes'
  );
  const originStrip = strips.find(
    (strip) => strip.stripId === configId && type === 'strips'
  );
  const activeConfig = originMix || originStrip;

  const handleSelection = () => {
    if (originMix && type === 'mixes') {
      onStripSelect(originMix.selected ? null : originMix.stripId, 'mixes');
    } else if (originStrip && type === 'strips') {
      onStripSelect(
        originStrip.selected ? null : originStrip.stripId,
        'strips'
      );
    }
  };

  if (!activeConfig) return null;

  return (
    <BaseStrip
      {...activeConfig}
      backgroundColor={type === 'mixes' ? 'bg-mix-bg' : 'bg-strip-bg'}
      header={type === 'mixes' ? `Mix #${configId}` : `Strip #${configId}`}
      config={stripId}
      sendLevels={sendLevels}
      isPFLInactive={isPFLInactive}
      onRemove={onRemove}
      handleSelection={handleSelection}
    />
  );
};
