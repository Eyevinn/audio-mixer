import { useState, useCallback, useMemo, useEffect } from 'react';
import { PanningLegend } from '../../../assets/icons/PanningLegend';
import debounce from 'lodash/debounce';

type PanningSliderProps = {
  inputValue: number;
  onChange: (panning: number) => void;
};

export const PanningSlider = ({ inputValue, onChange }: PanningSliderProps) => {
  const [localValue, setLocalValue] = useState(inputValue);
  const [isDragging, setIsDragging] = useState(false);

  // Throttle WebSocket updates
  const throttledPanningChange = useMemo(
    () =>
      debounce((value: number) => {
        onChange(value);
      }, 50),
    [onChange]
  );

  // Update local value when input changes from outside
  useEffect(() => {
    if (!isDragging) {
      setLocalValue(inputValue);
    }
  }, [inputValue, isDragging]);

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);

      // Update local state immediately for smooth visual feedback
      setLocalValue(newValue);

      // Throttle the WebSocket updates
      throttledPanningChange(newValue);
    },
    [throttledPanningChange]
  );

  return (
    <div className="relative w-[80px] h-[50px] mb-3">
      <PanningLegend />
      <input
        type="range"
        className="absolute w-[80px] h-[5px] left-[2px] bg-[#d3d3d3] outline-none
        opacity-[0.7] transition-opacity duration-200 transform mt-[18px] mb-[10px]
        hover:opacity-[1] slider-track [&::-webkit-slider-thumb]:pan-slider-thumb [&::-moz-range-thumb]:pan-slider-thumb"
        min={0}
        max={128}
        step={1}
        value={localValue}
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
        onChange={onChangeHandler}
      />
    </div>
  );
};
