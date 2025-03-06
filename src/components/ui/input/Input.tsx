import React from 'react';

type TInputProps = {
  className?: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type TStripInputProps = {
  type?: string;
  value: string;
  configMode?: boolean;
  onChange: (input: string) => void;
};

export const Input = ({
  className,
  type,
  value,
  placeholder,
  error,
  onKeyDown,
  onChange
}: TInputProps) => {
  return (
    <input
      className={`${className} text-sm border-2 bg-modal-bg hover:bg-input-hover text-white py-2 px-4 rounded h-fit w-full font-normal ${error ? 'border-delete' : 'border-bg-border'}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
};

export const StripInput = ({ type, value, onChange }: TStripInputProps) => {
  return (
    <div className="flex justify-between text-sm items-center px-4 py-1">
      <label htmlFor={type} className="text-white">
        {type}
      </label>
      <input
        id={type}
        type="number"
        placeholder="Input Slot"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[6rem] px-2 py-1 bg-input-field text-black text-center text-sm rounded"
      />
    </div>
  );
};

export const LabelInput = ({
  value,
  configMode,
  onChange
}: TStripInputProps) => {
  return (
    <div
      className={`${configMode ? 'bg-selected-mix-bg pb-1 border border-selected-mix-border border-t-0' : ''} w-full px-4 items-center`}
    >
      <input
        type="text"
        maxLength={15}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[8rem] bg-label-field text-black g-transparent outline-none text-center py-1 text-sm rounded mb-2 truncate overflow-hidden whitespace-nowrap px-1"
      />
    </div>
  );
};
