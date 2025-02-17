import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SliderLegend } from '../../../assets/icons/SliderLegend';
import debounce from 'lodash/debounce';

type VolumeSliderProps = {
  type: 'mixer' | 'master';
  inputVolume?: number;
  onVolumeChange: (volume: number) => void;
};

export const VolumeSlider = ({
  type,
  inputVolume,
  onVolumeChange
}: VolumeSliderProps) => {
  const [volume, setVolume] = useState(40);
  const [isDragging, setIsDragging] = useState(false);

  const volumeValToPos = (val: number): number =>
    Math.round(((val + 60) * 127) / 70);
  const volumePosToVal = (pos: number): number => (pos * 70) / 127 - 60;

  // Throttle WebSocket updates
  const throttledVolumeChange = useMemo(
    () =>
      debounce((value: number) => {
        onVolumeChange(value);
      }, 50),
    [onVolumeChange]
  );

  useEffect(() => {
    if (inputVolume && !isDragging) {
      setVolume(inputVolume);
    }
  }, [inputVolume, isDragging]);

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);

      // Update local state immediately for smooth visual feedback
      if (type === 'master') {
        setVolume(newValue);
      } else {
        setVolume(volumePosToVal(newValue));
      }

      // Throttle the WebSocket updates
      if (type === 'mixer') {
        throttledVolumeChange(volumePosToVal(newValue));
      } else {
        throttledVolumeChange(newValue);
      }
    },
    [type, throttledVolumeChange]
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
        value={type === 'master' ? volume : volumeValToPos(volume)}
        onChange={onChangeHandler}
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
        }}
        onMouseUp={() => {
          setIsDragging(false);
        }}
        onMouseLeave={() => {
          setIsDragging(false);
        }}
        onDoubleClick={() => {
          if (type === 'master') {
            setVolume(0);
            onVolumeChange(0);
          }
        }}
      />
    </div>
  );
};
