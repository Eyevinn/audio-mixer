import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PanningLegend } from '../../../../assets/icons/PanningLegend';
import debounce from 'lodash/debounce';
import { SetValueButtons } from './SetValueButtons';
import { useHandleChange } from '../../../../hooks/useHandleChange';
import { useGlobalState } from '../../../../context/GlobalStateContext';
import { TAudioStrip, TMixStrip } from '../../../../types/types';
import logger from '../../../../utils/logger';

type PanningSliderProps = {
  inputValue: number;
  type: 'strips' | 'mixes';
  id: number;
  config?: number;
};

export const PanningSlider = ({
  inputValue,
  type,
  id,
  config
}: PanningSliderProps) => {
  const [localValue, setLocalValue] = useState(inputValue || 0);
  const panningPosToVal = (pos: number): number => pos / 64 - 1.0;
  const { setStrips, setMixes } = useGlobalState();
  const { handleChange } = useHandleChange();

  // Throttle WebSocket updates
  const throttledPanningChange = useMemo(
    () =>
      debounce((value: number) => {
        const newVal = panningPosToVal(value);
        handleChange(type, id, 'panning', newVal, config);
        const editFunc = type === 'strips' ? setStrips : setMixes;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        editFunc((prevState: any) =>
          prevState.map((strip: TAudioStrip | TMixStrip) => {
            if (strip.stripId !== id) return strip;
            return {
              ...strip,
              filters: {
                ...strip.filters,
                pan: {
                  value: newVal
                }
              }
            };
          })
        );
      }, 500),
    [handleChange, type, id, config, setMixes, setStrips]
  );

  // Update local value when input changes from outside
  useEffect(() => {
    if (typeof inputValue === 'number' && !isNaN(inputValue)) {
      setLocalValue(inputValue);
    }
  }, [inputValue, id]);

  const onChangeHandler = useCallback(
    (newValue: number) => {
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
      <SetValueButtons onChange={onChangeHandler} />
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
        }}
        onChange={(e) => onChangeHandler(parseInt(e.target.value))}
      />
    </div>
  );
};
