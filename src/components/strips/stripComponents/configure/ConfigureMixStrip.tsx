import React from 'react';
import { BaseStrip } from '../../BaseStrip';
import { useGlobalState } from '../../../../context/GlobalStateContext';
import { useWebSocket } from '../../../../context/WebSocketContext';

interface MixStripProps {
  stripId: number;
  configId: number;
  sendLevels: {
    muted: boolean;
    volume: number;
    origin: 'pre_fader' | 'post_fader';
  };
  type: 'mixes' | 'strips';
  isPFLActive: boolean | undefined;
  onStripSelect: (stripId: number | null, type: 'mixes' | 'strips') => void;
  onRemove: () => void;
}

export const ConfigureMixStrip: React.FC<MixStripProps> = ({
  stripId,
  configId,
  sendLevels,
  type,
  isPFLActive,
  onStripSelect,
  onRemove
}) => {
  const { sendMessage } = useWebSocket();
  const { mixes, strips, setMixes, setStrips } = useGlobalState();

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

  const handleMixChange = (
    id: number,
    property: string,
    value: number | boolean | string | undefined
  ) => {
    if (property === 'pfl') {
      return sendMessage({
        type: 'set',
        resource: `/audio/mixes/1000/inputs/${type}/${id}`,
        body: {
          muted: value
        }
      });
    }

    const isSendLevelProperty =
      configId &&
      (property === 'volume' || property === 'muted' || property === 'origin');

    if (isSendLevelProperty) {
      setMixes(
        mixes.map((mix) =>
          mix.stripId === stripId
            ? {
                ...mix,
                inputs: {
                  ...mix.inputs,
                  [type]: {
                    ...mix.inputs[type],
                    [id]: {
                      ...mix.inputs[type][id],
                      [property]: value
                    }
                  }
                }
              }
            : mix
        )
      );
    } else if (type === 'mixes') {
      setMixes(
        mixes.map((mix) =>
          mix.stripId === id ? { ...mix, [property]: value } : mix
        )
      );
    } else if (type === 'strips') {
      setStrips(
        strips.map((strip) =>
          strip.stripId === id ? { ...strip, [property]: value } : strip
        )
      );
    }

    // If the value is undefined, do not send the message.
    // Needed for the input fields, so the input fields can be cleared
    if (value === undefined) return;

    if (property === 'label') {
      sendMessage({
        type: 'set',
        resource: `/audio/${type}/${id}`,
        body: { [property]: value }
      });
    } else if (!configId && (property === 'volume' || property === 'muted')) {
      sendMessage({
        type: 'set',
        resource: `/audio/${type}/${id}/fader`,
        body: { [property]: value }
      });
    } else if (isSendLevelProperty) {
      sendMessage({
        type: 'set',
        resource: `/audio/mixes/${stripId}/inputs/${type}/${id}`,
        body: { [property]: value }
      });
    } else if (property === 'panning') {
      sendMessage({
        type: 'set',
        resource: `/audio/${type}/${id}/filters/pan`,
        body: { value: value }
      });
    }
  };

  if (!activeConfig) return null;

  return (
    <BaseStrip
      {...activeConfig}
      backgroundColor={type === 'mixes' ? 'bg-mix-bg' : 'bg-strip-bg'}
      header={type === 'mixes' ? `Mix #${configId}` : `Strip #${configId}`}
      config={configId}
      sendLevels={sendLevels}
      isPFLActive={isPFLActive}
      handleStripChange={handleMixChange}
      onRemove={onRemove}
      handleSelection={handleSelection}
    />
  );
};
