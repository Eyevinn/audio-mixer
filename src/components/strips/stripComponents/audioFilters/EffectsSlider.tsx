import React from 'react';

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
  onChange: (value: number) => void;
  onDoubleClick?: () => void;
}

export const EffectsSlider: React.FC<EffectsSliderProps> = ({
  id,
  text,
  min,
  max,
  value,
  step,
  unit,
  onChange,
  onDoubleClick
}) => {
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
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        onDoubleClick={onDoubleClick}
        className="w-[200px] slider-track [&::-webkit-slider-thumb]:slider-thumb [&::-moz-range-thumb]:slider-thumb"
      />
      <output id={`${id}_slider_value`} className="ml-2">
        {value} {unit}
      </output>
    </div>
  );
};
