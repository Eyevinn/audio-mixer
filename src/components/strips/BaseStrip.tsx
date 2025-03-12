import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import { TAudioStrip, TBaseStrip, TMixStrip, TOutput } from '../../types/types';
import { ActionButton } from '../ui/buttons/Buttons';
import { StripDropdown } from '../ui/dropdown/Dropdown';
import { LabelInput } from '../ui/input/Input';
import { EbuMeters } from './outputStrip/EbuMeters';
import { ResetButton } from './outputStrip/ResetButton';
import { AudioLevel } from './stripComponents/audioLevel/AudioLevel';
import { PanningSlider } from './stripComponents/panningSlider/PanningSlider';
import { StripHeader } from './stripComponents/stripHeader/StripHeader';
import { VolumeSlider } from './stripComponents/volumeSlider/VolumeSlider';

interface BaseStripProps extends TBaseStrip {
  isBeingConfigured?: boolean;
  isHighlighted?: boolean;
  input?: {
    first_channel: number;
    input_slot: number;
    is_stereo: boolean;
    second_channel: number;
  };
  output?: TOutput;
  backgroundColor: string;
  header: string;
  copyButton?: boolean;
  config?: number;
  sendLevels?: {
    muted: boolean;
    volume: number;
    origin: 'pre_fader' | 'post_fader';
  };
  isPFLInactive: boolean | undefined;
  isOutputStrip?: boolean;
  removingOutputWarning?: string | string[];
  onReset?: () => void;
  onRemove?: () => void;
  onRemoveFromMix?: (input: TAudioStrip | TMixStrip) => void;
  handleSelection: () => void;
  handleStripChange: (
    stripId: number,
    property: string,
    value: number | boolean | string | undefined
  ) => void;
  onCopy?: () => void;
  children?: React.ReactNode;
}

export const BaseStrip: React.FC<BaseStripProps> = ({
  isBeingConfigured,
  isHighlighted,
  removingOutputWarning,
  stripId,
  label,
  selected,
  fader,
  filters,
  input,
  output,
  pre_fader_meter,
  backgroundColor,
  header,
  copyButton,
  config,
  sendLevels,
  isPFLInactive,
  isOutputStrip,
  onReset,
  onRemove,
  onRemoveFromMix,
  handleStripChange,
  handleSelection,
  onCopy,
  children
}) => {
  const inputId = config ?? stripId;
  const [stripLabel, setStripLabel] = useState<string>(inputId.toString());
  const [isScreenTall, setIsScreenTall] = useState<boolean>(
    window.innerHeight > 1200
  );
  const configMode =
    sendLevels?.muted !== undefined &&
    sendLevels?.volume !== undefined &&
    sendLevels?.origin !== undefined &&
    config !== undefined;
  const panningValToPos = (val: number): number => Math.round((val + 1) * 64);
  const panningPosToVal = (pos: number): number => pos / 64 - 1.0;
  const { sendMessage } = useWebSocket();

  const isPFLInput =
    output?.input.index === 1000 && output?.input.source === 'mix';
  const showEbuMeters =
    isOutputStrip && output && output.meters.enable_ebu_meters && onReset;

  useEffect(() => {
    const handleResize = () => {
      setIsScreenTall(window.innerHeight > 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderButtonColor = (label: string) => {
    switch (label) {
      case 'SELECT':
        return selected ? 'bg-select-btn' : 'bg-default-btn';
      case 'PFL':
        return !isPFLInactive ? 'bg-pfl-btn' : 'bg-default-btn';
      case 'MUTE':
        if (configMode) {
          return 'invisible';
        } else {
          return fader?.muted ? 'bg-mute-btn' : 'bg-default-btn';
        }
      default:
        return 'bg-default-btn';
    }
  };

  const handlePFLChange = (value: boolean | undefined) => {
    if (value === undefined) return;

    const type = header.includes('Mix') ? 'mixes' : 'strips';
    sendMessage({
      type: 'set',
      resource: `/audio/mixes/1000/inputs/${type}/${inputId}`,
      body: {
        muted: value
      }
    });
  };

  const renderPanningAndActions = () => {
    if (isPFLInput) return;
    return (
      <div className="flex flex-col">
        {/* Panning Slider */}
        <PanningSlider
          inputValue={panningValToPos(filters ? filters.pan.value : 0)}
          onChange={(panning) =>
            handleStripChange(inputId, 'panning', panningPosToVal(panning))
          }
        />
        <div className="flex flex-col justify-end">
          {['SELECT', 'PFL', 'MUTE'].map((label, index) => (
            <ActionButton
              key={index}
              label={label}
              buttonColor={renderButtonColor(label)}
              onClick={(e) => {
                e.stopPropagation();
                switch (label) {
                  case 'SELECT':
                    handleSelection();
                    break;
                  case 'PFL':
                    handlePFLChange(!isPFLInactive);
                    break;
                  case 'MUTE':
                    handleStripChange(inputId, 'muted', !fader?.muted);
                    break;
                }
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`box-border flex flex-col relative rounded-lg h-full
        ${backgroundColor}
        ${isScreenTall || !isOutputStrip ? 'w-fit' : 'w-56'}
        ${isHighlighted ? 'border-2 border-white' : ''}
        ${isBeingConfigured ? 'border-2 border-white' : ''}
        ${selected && !isBeingConfigured ? 'border-[1px] border-gray-400' : ''}
      `}
    >
      {/* Strip Info */}
      {isOutputStrip ? (
        <div className="h-2" />
      ) : (
        <StripHeader
          label={label || header}
          configMode={configMode}
          copyButton={copyButton}
          isRemovingFromMix={configMode}
          isOutputStrip={isOutputStrip}
          onRemove={onRemove}
          onRemoveFromMix={onRemoveFromMix}
          onCopy={onCopy}
          removingOutputWarning={removingOutputWarning}
        />
      )}

      {/* Config Fields */}
      {configMode && (
        <StripDropdown
          options={['pre_fader', 'post_fader']}
          configMode={configMode}
          value={sendLevels?.origin}
          onChange={(origin) => handleStripChange(inputId, 'origin', origin)}
        />
      )}

      {/* Label Input */}
      <LabelInput
        isOutputStrip={isOutputStrip}
        value={label === '' ? stripLabel : label}
        configMode={configMode}
        isPFLInput={isPFLInput}
        onChange={(updatedLabel) => {
          setStripLabel(updatedLabel);
          handleStripChange(inputId, 'label', updatedLabel);
        }}
      />

      {isOutputStrip && !isPFLInput && (
        <StripDropdown
          options={['pre_fader', 'post_fader']}
          value={output?.input.origin || 'post_fader'}
          onChange={(origin) => handleStripChange(stripId, 'origin', origin)}
        />
      )}

      {/* Audio Strip Fields */}
      {children}

      <div className="flex flex-col items-center flex-wrap w-full mt-5">
        <div
          className={`${isOutputStrip && output?.meters.enable_ebu_meters ? 'flex-col items-center' : ''} w-full flex justify-evenly mb-5`}
        >
          <div
            className={`${isScreenTall ? '' : 'scale-90'} flex flex-row space-x-4 px-4`}
          >
            {/* Audio Levels */}
            {!isPFLInput && !output?.meters.enable_ebu_meters && (
              <AudioLevel
                isStereo={input?.is_stereo ?? true}
                audioBarData={{
                  peak_left: isOutputStrip
                    ? output?.meters.peak_left
                    : pre_fader_meter?.peak_left,
                  peak_right: isOutputStrip
                    ? output?.meters.peak_right
                    : pre_fader_meter?.peak_right
                }}
              />
            )}

            {!showEbuMeters && renderPanningAndActions()}

            {showEbuMeters && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <EbuMeters
                  ebu_i={output?.meters.ebu_i}
                  ebu_m={output?.meters.ebu_m}
                  ebu_s={output?.meters.ebu_s}
                />
                <ResetButton onClick={onReset} />
              </div>
            )}

            {!isScreenTall && showEbuMeters && renderPanningAndActions()}
          </div>
        </div>

        {isScreenTall && showEbuMeters && renderPanningAndActions()}

        {/* Volume Slider */}
        <div
          className={`flex ${output?.meters.enable_ebu_meters ? 'flex-row justify-center space-x-8 px-4' : 'flex-col'} pt-2 pb-5 w-full items-center ${configMode ? 'scale-100 border border-selected-mix-border rounded-b-lg bg-dark-purple absolute bottom-0 left-0' : ''} ${isOutputStrip ? 'absolute bottom-0' : ''}`}
        >
          {configMode && <p className="text-base pb-2">Send Level</p>}
          {output?.meters.enable_ebu_meters && (
            <AudioLevel
              isStereo={input?.is_stereo ?? true}
              audioBarData={{
                peak_left: output?.meters.peak_left,
                peak_right: output?.meters.peak_right
              }}
            />
          )}
          <div className={`${isScreenTall || configMode ? '' : 'scale-75'}`}>
            <VolumeSlider
              isDisabled={
                output && output.input.origin === 'pre_fader' && !isPFLInput
              }
              inputVolume={configMode ? sendLevels?.volume : fader?.volume}
              onVolumeChange={(vol: number) =>
                handleStripChange(inputId, 'volume', vol)
              }
            />
          </div>
          {configMode && (
            <ActionButton
              label={'MUTE'}
              buttonColor={sendLevels?.muted ? 'bg-mute-btn' : 'bg-default-btn'}
              onClick={(e) => {
                e.stopPropagation();
                handleStripChange(config, 'muted', !sendLevels?.muted);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
