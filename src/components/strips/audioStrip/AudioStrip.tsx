import React from 'react';
import { AudioLevel } from '../audioLevel/AudioLevel';
import { VolumeSlider } from '../volumeSlider/VolumeSlider';
import { PanningSlider } from '../panningSlider/PanningSlider';
import { ActionButton } from '../../ui/buttons/Buttons';
import { StripHeader } from '../stripHeader/StripHeader';
import { StripDropdown } from '../../ui/dropdown/Dropdown';
import { useWebSocket } from '../../../context/WebSocketContext';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { LabelInput, StripInput } from '../../ui/input/Input';

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
  onSelect: () => void;
  onRemove: () => void;
}

export const AudioStrip: React.FC<AudioStripProps> = ({
  id: stripId,
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
  onSelect,
  onRemove
}) => {
  const panningValToPos = (val: number): number => Math.round((val + 1) * 64);
  const panningPosToVal = (pos: number): number => pos / 64 - 1.0;
  const { sendMessage } = useWebSocket();
  const { savedStrips, setSavedStrips } = useGlobalState();

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

  const handleStripChange = (
    stripId: number,
    property: string,
    value: number | boolean | string | undefined
  ) => {
    setSavedStrips(
      savedStrips.map((strip) =>
        strip.id === stripId ? { ...strip, [property]: value } : strip
      )
    );

    if (!value) return;

    if (property === 'selected') return;

    if (property === 'label') {
      // ToDo: Fix endpoint
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}`,
        body: { [property]: value }
      });
    } else {
      // ToDo: Fix endpoint
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/input`,
        body: { value }
      });
    }
  };

  return (
    <div
      className={`flex flex-col w-fit h-fit relative rounded-lg bg-strip-bg ${selected ? 'border-[1px] border-gray-400' : ''}`}
    >
      {/* Strip Info */}
      <StripHeader label={`Strip #${slot}`} onRemove={onRemove} />

      {/* Label Input */}
      <LabelInput
        value={label}
        onChange={(label) => handleStripChange(stripId, 'label', label)}
      />

      {/* Slot Input */}
      <StripInput
        type="Slot"
        value={slot !== undefined ? slot.toString() : ''}
        onChange={(slot: string) =>
          handleStripChange(
            stripId,
            'slot',
            slot !== '' ? parseInt(slot, 10) : ''
          )
        }
      />

      {/* Mode Select */}
      <StripDropdown
        type="Mode"
        options={['Mono', 'Stereo']}
        value={mode}
        onChange={(mode: string) => handleStripChange(stripId, 'mode', mode)}
      />

      {/* Left Ch Select */}
      <StripDropdown
        type="Left Ch"
        options={['0', '1']}
        value={channel1.toString()}
        onChange={(channel1: string) =>
          handleStripChange(stripId, 'channel1', parseInt(channel1, 10))
        }
      />

      {/* Right Ch Select */}
      <StripDropdown
        type="Right Ch"
        options={['0', '1']}
        value={channel2.toString()}
        onChange={(channel2: string) =>
          handleStripChange(stripId, 'channel2', parseInt(channel2, 10))
        }
        hidden={mode === 'mono'}
      />

      <div className="flex flex-col items-center flex-wrap w-full mt-5 mb-3">
        <div className="w-full flex justify-evenly mb-5">
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
            {/* Panning Slider */}
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
                        // handleStripChange(stripId, 'selected', !selected);
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
        {/* Volume Slider */}
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
