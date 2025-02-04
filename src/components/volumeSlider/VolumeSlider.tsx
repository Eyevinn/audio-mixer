import { useEffect, useState } from 'react';
import { SliderLegend } from '../../assets/icons/SliderLegend';

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
  const volumeValToPos = (val: number): number =>
    Math.round(((val + 60) * 127) / 70);
  const volumePosToVal = (pos: number): number => (pos * 70) / 127 - 60;

  useEffect(() => {
    if (inputVolume) {
      setVolume(inputVolume);
    }
  }, [inputVolume]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);

    switch (type) {
      case 'mixer':
        onVolumeChange(volumePosToVal(parseInt(e.target.value)));
        break;
      case 'master':
        setVolume(newValue);
        onVolumeChange(newValue);
        break;
    }
  };

  return (
    <div className="relative w-[72px] h-[346px] ml-[5px]">
      <SliderLegend />
      <input
        type="range"
        className="absolute w-[346px] h-[5px] bg-[#d3d3d3] outline-none
        opacity-[0.7] transition-opacity duration-200 transform -rotate-90
        left-[-131px] top-[167px] hover:opacity-[1] slider-track [&::-webkit-slider-thumb]:volume-slider-thumb [&::-moz-range-thumb]:volume-slider-thumb"
        min="0"
        max="127"
        step="1"
        value={type === 'master' ? volume : volumeValToPos(volume)}
        onChange={(e) => onChangeHandler(e)}
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
