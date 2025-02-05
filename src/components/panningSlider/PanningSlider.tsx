import { PanningLegend } from '../../assets/icons/PanningLegend';

type PanningSliderProps = {
  inputValue: number;
  onChange: (panning: string) => void;
};

export const PanningSlider = ({ inputValue, onChange }: PanningSliderProps) => {
  return (
    <div className="relative w-[80px] h-[50px] mb-3">
      <PanningLegend />
      <input
        type="range"
        className="absolute w-[80px] h-[5px] left-[2px] bg-[#d3d3d3] outline-none
        opacity-[0.7] transition-opacity duration-200 transform mt-[18px] mb-[10px]
        hover:opacity-[1] slider-track [&::-webkit-slider-thumb]:pan-slider-thumb [&::-moz-range-thumb]:pan-slider-thumb"
        min="0"
        max="128"
        step="1"
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
