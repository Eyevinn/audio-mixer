import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

interface EffectsSliderProps {
  id: string;
  text: string;
  min: number;
  max: number;
  value: number;
  step: number;
  unit: string;
  filter: string;
  parameter: string;
  onChange: (filterType: string, filter: string, value: number) => void;
  onDoubleClick?: () => void;
}

export const EffectsSlider = ({
  id,
  text,
  min,
  max,
  value,
  step,
  unit,
  filter,
  parameter,
  onChange,
  onDoubleClick
}: EffectsSliderProps) => {
  const [sliderValue, setSliderValue] = useState<number>(value);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const debouncedChange = useMemo(
    () => debounce((value: number) => onChange(filter, parameter, value), 500),
    [onChange, parameter, filter]
  );

  const handleChange = (val: number) => {
    setSliderValue(val);
    debouncedChange(val);
  };

  return (
    <div className="py-[5px] text-sm">
      <label htmlFor={`${id}_slider`} className="w-[150px] inline-block">
        {text}
      </label>
      <input
        type="range"
        id={`${id}_slider`}
        min={min}
        max={max}
        value={sliderValue}
        step={step}
        onChange={(e) => handleChange(Number(e.target.value))}
        onDoubleClick={onDoubleClick}
        className="w-[200px] slider-track [&::-webkit-slider-thumb]:slider-thumb [&::-moz-range-thumb]:slider-thumb"
      />
      <output id={`${id}_slider_value`} className="ml-2">
        {sliderValue} {unit}
      </output>
    </div>
  );
};
