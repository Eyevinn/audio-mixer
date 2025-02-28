import React, { useState } from 'react';
import { TAudioStrip, TBaseStrip, TMixStrip } from '../../types/types';
import { ActionButton } from '../ui/buttons/Buttons';
import { StripDropdown } from '../ui/dropdown/Dropdown';
import { LabelInput } from '../ui/input/Input';
import { AudioLevel } from './stripComponents/audioLevel/AudioLevel';
import { PanningSlider } from './stripComponents/panningSlider/PanningSlider';
import { VolumeSlider } from './stripComponents/volumeSlider/VolumeSlider';
import { StripHeader } from './stripComponents/stripHeader/StripHeader';

interface BaseStripProps extends TBaseStrip {
  isBeingConfigured?: boolean;
  isRemovingFromMix?: boolean;
  isHighlighted?: boolean;
  input?: {
    first_channel: number;
    input_slot: number;
    is_stereo: boolean;
    second_channel: number;
  };
  backgroundColor: string;
  header: string;
  copyButton?: boolean;
  config?: number;
  sendLevels?: {
    muted: boolean;
    volume: number;
    origin: 'pre_fader' | 'post_fader';
  };
  isPFLActive: boolean | undefined;
  onRemove: () => void;
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
  isRemovingFromMix,
  isHighlighted,
  stripId,
  label,
  selected,
  fader,
  filters,
  input,
  pre_fader_meter,
  backgroundColor,
  header,
  copyButton,
  config,
  sendLevels,
  isPFLActive,
  onRemove,
  onRemoveFromMix,
  handleStripChange,
  handleSelection,
  onCopy,
  children
}) => {
  const inputId = config ?? stripId;
  const [stripLabel, setStripLabel] = useState(inputId.toString());
  const configMode =
    sendLevels?.muted !== undefined &&
    sendLevels?.volume !== undefined &&
    sendLevels?.origin !== undefined &&
    config !== undefined;
  const panningValToPos = (val: number): number => Math.round((val + 1) * 64);
  const panningPosToVal = (pos: number): number => pos / 64 - 1.0;

  const renderButtonColor = (label: string) => {
    switch (label) {
      case 'SELECT':
        return selected ? 'bg-select-btn' : 'bg-default-btn';
      case 'PFL':
        return isPFLActive ? 'bg-pfl-btn' : 'bg-default-btn';
      case 'MUTE':
        if (configMode) {
          return 'invisible';
        } else {
          return fader.muted ? 'bg-mute-btn' : 'bg-default-btn';
        }
      default:
        return 'bg-default-btn';
    }
  };

  return (
    <div
      className={`box-border flex flex-col w-fit h-full relative rounded-lg ${isHighlighted ? 'border-2 border-white' : ''} ${isBeingConfigured ? 'border-2 border-white' : ''} ${backgroundColor} ${selected && !isBeingConfigured ? 'border-[1px] border-gray-400' : ''}`}
    >
      {/* Strip Info */}
      <StripHeader
        label={header}
        copyButton={copyButton}
        isRemovingFromMix={isRemovingFromMix}
        onRemove={onRemove}
        onRemoveFromMix={onRemoveFromMix}
        onCopy={onCopy}
      />

      {/* Config Fields */}
      {configMode && (
        <StripDropdown
          options={['pre_fader', 'post_fader']}
          value={sendLevels?.origin}
          onChange={(origin) => handleStripChange(inputId, 'origin', origin)}
        />
      )}

      {/* Label Input */}
      <LabelInput
        value={label === '' ? stripLabel : label}
        onChange={(updatedLabel) => {
          setStripLabel(updatedLabel);
          handleStripChange(inputId, 'label', updatedLabel);
        }}
      />
      {/* Audio Strip Fields */}
      {children}

      <div className="flex flex-col items-center flex-wrap w-full mt-5">
        <div className="w-full flex justify-evenly mb-5">
          {/* Audio Levels */}
          <AudioLevel
            isStereo={input?.is_stereo ?? true}
            audioBarData={{
              peak_left: pre_fader_meter.peak_left,
              peak_right: pre_fader_meter.peak_right
            }}
          />
          {/* Control Buttons */}
          <div className="flex flex-col justify-end">
            {/* Panning Slider */}
            <PanningSlider
              inputValue={panningValToPos(filters.pan.value)}
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
                        handleStripChange(inputId, 'pfl', isPFLActive);
                        break;
                      case 'MUTE':
                        handleStripChange(inputId, 'muted', !fader.muted);
                        break;
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Volume Slider */}
        <div
          className={`flex flex-col pt-2 pb-5 w-full items-center ${configMode ? 'border border-almost-white rounded-b-lg bg-dark-purple absolute bottom-0 left-0' : ''}`}
        >
          {configMode && <p className="text-base pb-2">Send Level</p>}
          <VolumeSlider
            type="mixer"
            inputVolume={configMode ? sendLevels?.volume : fader.volume}
            onVolumeChange={(vol: number) =>
              handleStripChange(inputId, 'volume', vol)
            }
          />
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
