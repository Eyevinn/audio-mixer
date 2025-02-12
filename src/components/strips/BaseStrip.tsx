import React from 'react';
import { AudioLevel } from './audioLevel/AudioLevel';
import { VolumeSlider } from './volumeSlider/VolumeSlider';
import { PanningSlider } from './panningSlider/PanningSlider';
import { ActionButton } from '../ui/buttons/Buttons';
import { LabelInput } from '../ui/input/Input';
import { StripHeader } from './stripHeader/StripHeader';

interface BaseStripProps {
  id: number;
  label: string;
  selected: boolean;
  panning: number;
  muted: boolean;
  pfl: boolean;
  volume: number;
  mode: 'mono' | 'stereo';
  slot: number;
  channel1: number;
  channel2: number;
  backgroundColor: string;
  header: string;
  copyButton?: boolean;
  onSelect: () => void;
  onRemove: () => void;
  handleStripChange: (stripId: number, property: string, value: any) => void;
  children?: React.ReactNode; // This will be either InputFields or your new component
}

export const BaseStrip: React.FC<BaseStripProps> = ({
  id: stripId,
  label,
  selected,
  panning,
  muted,
  pfl,
  volume,
  mode,
  // slot,
  channel1,
  channel2,
  backgroundColor,
  header,
  copyButton,
  onSelect,
  onRemove,
  handleStripChange,
  children
}) => {
  const panningValToPos = (val: number): number => Math.round((val + 1) * 64);
  const panningPosToVal = (pos: number): number => pos / 64 - 1.0;

  const renderButtonColor = (label: string) => {
    switch (label) {
      case 'SELECT':
        return selected ? 'bg-select-btn' : 'bg-default-btn';
      case 'PFL':
        return pfl ? 'bg-pfl-btn' : 'bg-default-btn';
      case 'MUTE':
        return muted ? 'bg-mute-btn' : 'bg-default-btn';
      default:
        return 'bg-default-btn';
    }
  };

  return (
    <div
      className={`flex flex-col w-fit h-fit relative rounded-lg ${backgroundColor} ${selected ? 'border-[1px] border-gray-400' : ''}`}
    >
      <StripHeader label={header} copyButton={copyButton} onRemove={onRemove} />
      <LabelInput
        value={label}
        onChange={(label) => handleStripChange(stripId, 'label', label)}
      />
      {children}
      <div className="flex flex-col items-center flex-wrap w-full mt-5 mb-3">
        <div className="w-full flex justify-evenly mb-5">
          <AudioLevel
            isStereo={mode === 'stereo'}
            audioBarData={{
              peak_left: channel1,
              peak_right: channel2
            }}
          />
          <div className="flex flex-col justify-end">
            <PanningSlider
              inputValue={panningValToPos(panning)}
              onChange={(panning) =>
                handleStripChange(
                  stripId,
                  'panning',
                  panningPosToVal(parseInt(panning))
                )
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
                        onSelect();
                        break;
                      case 'PFL':
                        handleStripChange(stripId, 'pfl', !pfl);
                        break;
                      case 'MUTE':
                        handleStripChange(stripId, 'muted', !muted);
                        break;
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <VolumeSlider
          type="mixer"
          inputVolume={volume}
          onVolumeChange={(volume: number) =>
            handleStripChange(stripId, 'volume', volume)
          }
        />
      </div>
    </div>
  );
};
