import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SliderLegend } from '../../../../assets/icons/SliderLegend';
import { useHandleChange } from '../../../../hooks/useHandleChange';
import { useGlobalState } from '../../../../context/GlobalStateContext';
import logger from '../../../../utils/logger';

type VolumeSliderProps = {
  inputVolume?: number;
  isDisabled?: boolean;
  type: 'strips' | 'mixes';
  id: number;
  config?: number;
};

function dBToRatio(db: number) {
  if (db < -200) return 0;
  return 10 ** (db / 20);
}

function ratioToDB(ratio: number) {
  return 20 * Math.log10(ratio);
}

function volumePosToVal(pos: number) {
  // translate 0-127 into into the dB from the legend
  let dB = 0;
  if (pos >= (0 / 16) * 128 && pos < (1 / 16) * 128) {
    dB = (16000 * pos) / 128 - 1060;
  } else if (pos >= (1 / 16) * 128 && pos < (4 / 16) * 128) {
    dB = (160 * pos) / 128 - 70;
  } else if (pos >= (4 / 16) * 128 && pos < (8 / 16) * 128) {
    dB = (80 * pos) / 128 - 50;
  } else if (pos >= (8 / 16) * 128 && pos < (16 / 16) * 128) {
    dB = (40 * pos) / 128 - 30;
  }

  return dBToRatio(dB);
}

function volumeValToPos(val: number) {
  let pos = 0;
  const dB = ratioToDB(Number(val));
  if (dB < -200) return 0;
  if (dB > -10 && dB <= 10) {
    pos = ((dB + 30) * 128) / 40;
  } else if (dB > -30 && dB <= -10) {
    pos = ((dB + 50) * 128) / 80;
  } else if (dB > -60 && dB <= -30) {
    pos = ((dB + 70) * 128) / 160;
  } else if (dB <= -60) {
    pos = ((dB + 1060) * 128) / 16000;
  }
  return Math.round(pos);
}

export const VolumeSlider = ({
  inputVolume,
  isDisabled,
  type,
  id,
  config
}: VolumeSliderProps) => {
  const [volume, setVolume] = useState(inputVolume ?? 0);
  const { updateStrip } = useGlobalState();
  const { handleChange } = useHandleChange();

  // Throttle WebSocket updates
  const throttledVolumeChange = useMemo(
    () =>
      debounce((value: number) => {
        handleChange(type, id, 'volume', value, config);
        if (config) {
          updateStrip(type, id, { volume: value }, config);
        } else {
          updateStrip(type, id, { fader: { volume: value } });
        }
      }, 500),
    [handleChange, config, id, type, updateStrip]
  );

  useEffect(() => {
    if (typeof inputVolume === 'number') {
      setVolume(inputVolume);
    }
  }, [inputVolume]);

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);
      // Update local state immediately for smooth visual feedback
      setVolume(volumePosToVal(newValue));
      // Throttle the WebSocket updates
      throttledVolumeChange(volumePosToVal(newValue));
    },
    [throttledVolumeChange]
  );

  return (
    <div
      className={`relative w-[72px] h-[280px] mr-[7px] ${isDisabled ? 'opacity-50' : ''}`}
    >
      <SliderLegend />
      <input
        type="range"
        className={`
          absolute w-[280px] h-[5px] outline-none opacity-[0.7] transition-opacity duration-200 transform -rotate-90 left-[-96px]
          top-[139px] slider-track [&::-webkit-slider-thumb]:volume-slider-thumb [&::-moz-range-thumb]:volume-slider-thumb
          ${isDisabled ? 'pointer-events-auto !cursor-not-allowed' : ''}
          ${isDisabled ? '' : 'hover:opacity-[1]'}
        `}
        min="0"
        max="127"
        step="1"
        value={volumeValToPos(volume)}
        onChange={onChangeHandler}
        onMouseDown={(e) => {
          if (isDisabled) {
            e.preventDefault();
          } else {
            e.stopPropagation();
          }
        }}
      />
    </div>
  );
};
