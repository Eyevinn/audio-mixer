import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '../../../assets/icons/Icons';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { TAudioStrip, TMixStrip } from '../../../types/types';

interface SelectProps {
  className?: string;
  value: string;
  options: (TAudioStrip | TMixStrip)[];
  onChange?: (value: TAudioStrip | TMixStrip) => void;
}

export const Select: React.FC<SelectProps> = ({
  className,
  value,
  options,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useOutsideClick(selectRef, () => setIsOpen(false));

  const handleSelect = (input: TAudioStrip | TMixStrip) => {
    if (onChange) {
      onChange(input);
    } else {
      navigate(`/mixes/${input.stripId}`, { replace: true });
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative w-64 ${className}`} ref={selectRef}>
      <button
        className={`${isOpen ? 'border-b-0 rounded-b-none' : ''} w-full px-4 py-2 text-white bg-modal-bg border-2 border-border-bg rounded-lg focus:outline-none flex justify-between items-center`}
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
              ? `Mix ${option.stripId} ${option.label}`
              : `Strip ${option.stripId} ${option.label}`;
            return (
              <li
                className={`px-4 py-2 cursor-pointer text-white hover:bg-zinc-700 ${value === (option.label || option.stripId.toString()) ? 'relative bg-slider-green mx-2 rounded-lg' : 'mx-2'}`}
                key={`${option.stripId}-${isMix ? 'mix' : 'strip'}`}
                onClick={() => handleSelect(option)}
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
