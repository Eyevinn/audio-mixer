import React, { useState } from 'react';
import { TBaseStrip } from '../../types/types';
import { ActionButton } from '../ui/buttons/Buttons';
import { LabelInput } from '../ui/input/Input';
import { AudioLevel } from './audioLevel/AudioLevel';
import { PanningSlider } from './panningSlider/PanningSlider';
import { StripHeader } from './stripHeader/StripHeader';
import { VolumeSlider } from './volumeSlider/VolumeSlider';

interface BaseStripProps extends TBaseStrip {
  input?: {
    first_channel: number;
    input_slot: number;
    is_stereo: boolean;
    second_channel: number;
  };
  mixes?: {
    muted: boolean;
    volume: number;
    origin: 'pre_fader' | 'post_fader';
  };
  strips?: {
    muted: boolean;
    volume: number;
    origin: 'pre_fader' | 'post_fader';
  };
  backgroundColor: string;
  header: string;
  copyButton?: boolean;
  onRemove: () => void;
  handleSelection: () => void;
  handleStripChange: (
    stripId: number,
    property: string,
    value: number | boolean | string | undefined
  ) => void;
  children?: React.ReactNode;
}

export const BaseStrip: React.FC<BaseStripProps> = ({
  stripId,
  label,
  selected,
  pfl,
  fader,
  filters,
  input,
  pre_fader_meter,
  backgroundColor,
  header,
  copyButton,
  onRemove,
  handleStripChange,
  handleSelection,
  children
}) => {
  const [stripLabel, setStripLabel] = useState(stripId.toString());
  const panningValToPos = (val: number): number => Math.round((val + 1) * 64);
  const panningPosToVal = (pos: number): number => pos / 64 - 1.0;

  const renderButtonColor = (label: string) => {
    switch (label) {
      case 'SELECT':
        return selected ? 'bg-select-btn' : 'bg-default-btn';
      case 'PFL':
        return pfl ? 'bg-pfl-btn' : 'bg-default-btn';
      case 'MUTE':
        return fader.muted ? 'bg-mute-btn' : 'bg-default-btn';
      default:
        return 'bg-default-btn';
    }
  };

  return (
    <div
      className={`flex flex-col w-fit h-fit relative rounded-lg ${backgroundColor} ${selected ? 'border-[1px] border-gray-400' : ''}`}
    >
      {/* Strip Info */}
      <StripHeader label={header} copyButton={copyButton} onRemove={onRemove} />
      {/* Label Input */}
      <LabelInput
        value={label === '' ? stripLabel : label}
        onChange={(updatedLabel) => {
          setStripLabel(updatedLabel);
          handleStripChange(stripId, 'label', updatedLabel);
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
                handleStripChange(stripId, 'panning', panningPosToVal(panning))
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
                        handleStripChange(stripId, 'pfl', !pfl);
                        break;
                      case 'MUTE':
                        handleStripChange(stripId, 'muted', !fader.muted);
                        break;
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Volume Slider */}
        <VolumeSlider
          type="mixer"
          inputVolume={fader.volume}
          onVolumeChange={(volume: number) =>
            handleStripChange(stripId, 'volume', volume)
          }
        />
      </div>
    </div>
  );
};
