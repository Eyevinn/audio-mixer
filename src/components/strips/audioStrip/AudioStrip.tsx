import React, { useState } from 'react';
import { AudioLevel } from '../audioLevel/AudioLevel';
import { VolumeSlider } from '../volumeSlider/VolumeSlider';
import { PanningSlider } from '../panningSlider/PanningSlider';
import { ActionButton } from '../../ui/buttons/Buttons';
import { StripHeader } from '../stripHeader/StripHeader';
import { useWebSocket } from '../../../context/WebSocketContext';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { LabelInput } from '../../ui/input/Input';
import { InputFields } from './InputFields';
import { Filters } from '../../../types/types';

interface AudioStripProps {
  stripId: number;
  label: string;
  selected: boolean;
  pfl: boolean;
  fader: {
    volume: number;
    muted: boolean;
  };
  filters: Filters;
  input: {
    first_channel: number;
    input_slot: number;
    is_stereo: boolean;
    second_channel: number;
  };
  input_meter: {
    peak?: number;
    peak_left?: number;
    peak_right?: number;
  };
  post_fader_meter: {
    peak_left: number;
    peak_right: number;
  };
  pre_fader_meter: {
    peak_left: number;
    peak_right: number;
  };
  onSelect: () => void;
  onRemove: () => void;
}

export const AudioStrip: React.FC<AudioStripProps> = ({
  stripId,
  label,
  selected,
  pfl,
  fader,
  filters,
  input,
  input_meter,
  // post_fader_meter, // TODO: Check if this is needed
  // pre_fader_meter, // TODO: Check if this is needed
  onSelect,
  onRemove
}) => {
  const [stripLabel, setStripLabel] = useState(stripId.toString());
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
        return fader.muted ? 'bg-mute-btn' : 'bg-default-btn';
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
        strip.stripId === stripId ? { ...strip, [property]: value } : strip
      )
    );

    // If the value is undefined, do not send the message.
    // Needed for the input fields, so the input fields can be cleared
    if (value === undefined) return;

    // Local states are not needed to be sent
    if (property === 'selected' || property === 'pfl') return;

    if (property === 'label') {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}`,
        body: { [property]: value }
      });
    } else if (
      property === 'input_slot' ||
      property === 'is_stereo' ||
      property === 'first_channel' ||
      property === 'second_channel'
    ) {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/input`,
        body: { [property]: value }
      });
    } else if (property === 'volume' || property === 'muted') {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/fader`,
        body: { [property]: value }
      });
    } else if (property === 'panning') {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/filters/pan`,
        body: { value: value }
      });
    }
  };

  return (
    <div
      className={`flex flex-col w-fit h-fit relative rounded-lg bg-strip-bg ${selected ? 'border-[1px] border-gray-400' : ''}`}
    >
      {/* Strip Info */}
      <StripHeader label={`Strip #${input.input_slot}`} onRemove={onRemove} />

      {/* Label Input */}
      <LabelInput
        value={label === '' ? stripLabel : label}
        onChange={(updatedLabel) => {
          setStripLabel(updatedLabel);
          handleStripChange(stripId, 'label', updatedLabel);
        }}
      />

      <InputFields
        slot={input.input_slot !== undefined ? input.input_slot.toString() : ''}
        isStereo={input.is_stereo}
        channel1={input.first_channel.toString()}
        channel2={input.second_channel.toString()}
        stripId={stripId}
        handleStripChange={handleStripChange}
      />

      <div className="flex flex-col items-center flex-wrap w-full mt-5 mb-3">
        <div className="w-full flex justify-evenly mb-5">
          {/* Audio Levels */}
          <AudioLevel
            isStereo={input.is_stereo}
            audioBarData={
              input.is_stereo
                ? {
                    peak_left: input_meter.peak_left,
                    peak_right: input_meter.peak_right
                  }
                : { peak: input_meter.peak }
            }
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
                        onSelect();
                        handleStripChange(stripId, 'selected', !selected);
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
