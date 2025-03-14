import React from 'react';
import { useWebSocket } from '../../../../context/WebSocketContext';
import { TAudioStrip, TMixStrip } from '../../../../types/types';
import Icons from '../../../../assets/icons/Icons';
import { MidSide } from './MidSide';
import { Equalizer } from './Equalizer';
import { Compressor } from './Compressor';
import { Trim } from './Trim';

interface EffectsPanelProps {
  strip: TAudioStrip | TMixStrip | undefined;
  type: 'mixes' | 'strips';
  isConfigPage?: boolean;
  onClose: () => void;
}

export const EffectsPanel = ({
  strip,
  type,
  isConfigPage,
  onClose
}: EffectsPanelProps) => {
  const { sendMessage, isConnected } = useWebSocket();

  const isStereo = () => {
    if (
      strip &&
      'input' in strip &&
      strip.input &&
      typeof strip.input === 'object'
    ) {
      const input = strip.input as { is_stereo?: boolean };
      if ('is_stereo' in input) {
        return input.is_stereo;
      }
    }
  };

  if (!strip) return null;

  const handleEffectChange = (
    filter: string,
    parameter: string,
    value: number | string | boolean
  ) => {
    const body =
      parameter === 'enabled'
        ? { [parameter]: value, input_format: 'lr_stereo' }
        : { [parameter]: value };

    if (isConnected) {
      sendMessage({
        type: 'set',
        resource: `/audio/${type}/${strip.stripId}/filters/${filter}`,
        body: body
      });
    }
  };

  return (
    <div className="h-full min-w-[38rem] overflow-y-auto rounded-tl-lg rounded-bl-lg border border-r-0 border-filter-highlited-bg bg-filter-bg p-2 text-white scrollbar-thumb-border-bg scrollbar-track-transparent scrollbar-thin box-border">
      <div className="flex justify-between items-center mb-2 mt-0">
        <h1 className="text-xl font-semibold">
          Settings for{' '}
          {strip.label ||
            `${type === 'mixes' ? 'Mix ' : 'Strip '} ${strip.stripId}`}
        </h1>
        <div onClick={onClose} className="hover:cursor-pointer">
          <Icons name="IconX" className="min-w-8 min-h-8 text-red-500" />
        </div>
      </div>

      {/* Trim Section */}
      <Trim strip={strip} handleEffectChange={handleEffectChange} />

      {/* MS Stereo Section */}
      {isStereo() && strip?.filters?.mid_side && !isConfigPage && (
        <MidSide
          midSide={strip.filters.mid_side}
          handleEffectChange={handleEffectChange}
        />
      )}

      {/* EQ Section */}
      <Equalizer
        strip={strip}
        type={type}
        handleEffectChange={handleEffectChange}
      />

      {/* Compressor Section */}
      <Compressor strip={strip} handleEffectChange={handleEffectChange} />
    </div>
  );
};
