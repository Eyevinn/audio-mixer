import React, { useEffect, useState, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { SliderLegend } from '../../../../assets/icons/SliderLegend';

type VolumeSliderProps = {
  inputVolume?: number;
  onVolumeChange: (volume: number) => void;
};

function dBToRatio(db: number) {
  return 10 ** (db / 10);
}

function ratioToDB(ratio: number) {
  return 10 * Math.log10(ratio);
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
  onVolumeChange
}: VolumeSliderProps) => {
  const [volume, setVolume] = useState(inputVolume ?? 0);

  // Throttle WebSocket updates
  const throttledVolumeChange = useMemo(
    () =>
      debounce((value: number) => {
        onVolumeChange(value);
      }, 500),
    [onVolumeChange]
  );

  useEffect(() => {
    if (inputVolume) {
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
    <div className="relative w-[72px] h-[346px] mr-[7px]">
      <SliderLegend />
      <input
        type="range"
        className="absolute w-[346px] h-[5px] bg-[#d3d3d3] outline-none
        opacity-[0.7] transition-opacity duration-200 transform -rotate-90
        left-[-131px] top-[170px] hover:opacity-[1] slider-track [&::-webkit-slider-thumb]:volume-slider-thumb [&::-moz-range-thumb]:volume-slider-thumb"
        min="0"
        max="127"
        step="1"
        value={volumeValToPos(volume)}
        onChange={onChangeHandler}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
};
