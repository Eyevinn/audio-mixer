import React from 'react';
import { AudioLevel } from '../AudioLevel';
import styles from './audioStrip.module.css';
import { VolumeSlider } from '../volumeSlider/VolumeSlider';
import { PanningSlider } from '../panningSlider/PanningSlider';
import { ActionButton } from '../buttons/Buttons';
import Icons from '../icons/Icons';

interface AudioStripProps {
  id: number;
  label: string;
  selected: boolean;
  slot: number;
  channel1: number;
  channel2: number;
  mode: 'mono' | 'stereo';
  panning: number;
  muted: boolean;
  pfl: boolean;
  volume: number;
  onLabelChange: (label: string) => void;
  onPanningChange: (panning: number) => void;
  onMuteChange: (muted: boolean) => void;
  onPflChange: (pfl: boolean) => void;
  onVolumeChange: (volume: number) => void;
  onSelect: () => void;
  onRemove: () => void;
}

export const AudioStrip: React.FC<AudioStripProps> = ({
  label,
  selected,
  slot,
  channel1,
  channel2,
  mode,
  panning,
  muted,
  pfl,
  volume,
  onLabelChange,
  onPanningChange,
  onMuteChange,
  onPflChange,
  onVolumeChange,
  onSelect,
  onRemove
}) => {
  const panningValToPos = (val: number): number => Math.round((val + 1) * 64);
  const panningPosToVal = (pos: number): number => pos / 64 - 1.0;

  const renderButtonColor = (label: string) => {
    switch (label) {
      case 'SELECT':
        return selected ? 'bg-select-green' : 'bg-dark-grey';
      case 'PFL':
        return pfl ? 'bg-pfl-yellow' : 'bg-dark-grey';
      case 'MUTE':
        return muted ? 'bg-mute-red' : 'bg-dark-grey';
      default:
        return 'bg-dark-grey';
    }
  };

  return (
    <div className="w-[8rem] h-[50rem] relative inline-block border-[0.1px] rounded-lg border-gray-500">
      <div className={styles.stripContainer}>
        {/* Strip Info */}
        <div className={styles.stripConfig}>
          <div className="text-sm text-center mb-2 text-white">
            Strip #{slot}
          </div>
          <button onClick={onRemove} className="w-[2rem] p-2">
            <Icons
              name="IconTrash"
              className="stroke-delete hover:cursor-pointer rounded-xl hover:bg-light place-self-end"
            />
          </button>
        </div>

        {/* Label Input */}
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          className="w-full px-2 py-1 bg-gray-700 text-white rounded mb-2"
        />

        {/* Mode Select */}
        <select
          value={mode}
          onChange={(e) => onLabelChange(e.target.value)}
          className="w-full px-2 py-1 bg-gray-700 text-white rounded mb-2"
        >
          <option value="mono">Mono</option>
          <option value="stereo">Stereo</option>
        </select>

        {/* Panning Slider */}
        <PanningSlider
          inputValue={panningValToPos(panning)}
          onChange={(panning) =>
            onPanningChange(panningPosToVal(parseInt(panning)))
          }
        />

        <div className="flex pb-4">
          {/* Audio Levels */}
          <AudioLevel
            isStereo={mode === 'stereo'}
            audioBarData={{
              peak_left: channel1,
              peak_right: channel2
            }}
          />
          {/* Control Buttons */}
          <div className="flex flex-col justify-end">
            {['SELECT', 'PFL', 'MUTE'].map((label, index) => (
              <ActionButton
                key={index}
                label={label}
                buttonColor={renderButtonColor(label)}
                onClick={(e) => {
                  e.stopPropagation();
                  switch (label) {
                    // TODO where is the select function?
                    case 'SELECT':
                      onSelect();
                      break;
                    case 'PFL':
                      onPflChange(!pfl);
                      break;
                    case 'MUTE':
                      onMuteChange(!muted);
                      break;
                  }
                }}
              />
            ))}
          </div>
        </div>
        <div className="relative w-[72px] h-[346px] ml-[5px]">
          {/* Volume Slider */}
          <VolumeSlider
            type="mixer"
            inputVolume={volume}
            onVolumeChange={onVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};
