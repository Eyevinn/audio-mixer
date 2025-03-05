import React, { useRef, useState } from 'react';
import Icons from '../../../assets/icons/Icons';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { TAudioStrip, TMixStrip } from '../../../types/types';

interface SelectProps {
  className?: string;
  nothingSelected?: string;
  value: string;
  options: (TAudioStrip | TMixStrip)[];
  onChange: (value: TAudioStrip | TMixStrip) => void;
  removeInput?: (input: TAudioStrip | TMixStrip) => void;
}

export const Select: React.FC<SelectProps> = ({
  className,
  value,
  options,
  onChange,
  removeInput
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(selectRef, () => setIsOpen(false));

  const handleSelect = (input: TAudioStrip | TMixStrip) => {
    onChange(input);
    setIsOpen(false);
  };

  const handleRemove = (input: TAudioStrip | TMixStrip) => {
    if (removeInput) {
      removeInput(input);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative w-48 ${className}`} ref={selectRef}>
      <button
        className={`${isOpen ? 'border-b-0 rounded-b-none' : ''} text-xl w-full pl-4 pr-2 py-2 text-white bg-modal-bg border-2 border-border-bg rounded-lg focus:outline-none flex justify-between items-center h-10`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
        <Icons name="IconChevronDown" className="" />
      </button>

      {isOpen && (
        <ul className="pb-2 absolute w-full bg-modal-bg border-2 border-border-bg border-t-0 rounded-b-lg shadow-lg max-h-60 overflow-y-auto z-10 scrollbar-thumb-border-bg scrollbar-track-transparent scrollbar-thin">
          {options.map((option) => {
            const isMix = option.inputs !== undefined;
            const renderLabel = isMix
              ? `${option.label || `Mix ${option.stripId}`}`
              : `${option.label || `Strip ${option.stripId}`}`;
            const isSelected = value === renderLabel;

            return (
              <li
                className={`px-4 py-2 cursor-pointer text-white hover:bg-zinc-700 ${isSelected ? 'relative bg-slider-green mx-2 rounded-lg' : 'mx-2'} h-fit flex items-center`}
                key={`${option.stripId}-${isMix ? 'mix' : 'strip'}`}
                onClick={
                  isSelected
                    ? () => handleRemove(option)
                    : () => handleSelect(option)
                }
              >
                {renderLabel}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
