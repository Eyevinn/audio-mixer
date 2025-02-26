import React, { useRef, useState } from 'react';
import Icons from '../../../assets/icons/Icons';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { TAudioStrip, TMixStrip } from '../../../types/types';

interface InputDropdownProps {
  label: string;
  options: (TAudioStrip | TMixStrip)[];
  selectedInputs?: (TAudioStrip | TMixStrip)[];
  mixToConfigure?: number | null;
  addInput: (input: TAudioStrip | TMixStrip) => void;
  removeInput: ({
    stripId,
    type
  }: {
    stripId: number;
    type: 'mixes' | 'strips';
  }) => void;
}

export const InputDropdown: React.FC<InputDropdownProps> = ({
  label,
  options,
  selectedInputs,
  mixToConfigure,
  addInput,
  removeInput
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative w-fit text-sm" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'border-b-0 rounded-b-none' : ''} bg-button-green hover:bg-button-green-hover flex items-center flex-row justify-between w-fit px-8 py-2 text-white rounded focus:outline-none`}
      >
        <span className="font-bold">{label}</span>
      </button>
      {isOpen && (
        <ul className="absolute w-full bg-modal-bg border-t-0 border-2 border-border-bg rounded-b-lg shadow-lg max-h-60 overflow-y-auto text-center scrollbar-thumb-border-bg scrollbar-track-transparent scrollbar-thin z-20">
          {options.map((option) => {
            const isMix = option.inputs !== undefined;
            const isSelected = selectedInputs?.some(
              (input) =>
                input.stripId === option.stripId &&
                (input.inputs !== undefined) === isMix
            );

            const renderLabel = isMix
              ? `Mix ${option.stripId + ' ' + option.label}`
              : `Strip ${option.stripId + ' ' + option.label}`;
            return (
              <li
                key={`${option.stripId}-${isMix ? 'mix' : 'strip'}`}
                className={`px-4 py-2 hover:bg-gray-700 text-white flex flex-row justify-between ${
                  mixToConfigure === option.stripId && isMix
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
                onClick={
                  isSelected
                    ? () => {
                        removeInput({
                          stripId: option.stripId,
                          type: isMix ? 'mixes' : 'strips'
                        });
                      }
                    : () => addInput(option)
                }
              >
                <span>{renderLabel}</span>
                {isSelected && <Icons name="IconCheck" className="ml-2" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
