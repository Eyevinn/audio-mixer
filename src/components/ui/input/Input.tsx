import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

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
  isPFLInput?: boolean;
  readOnly?: boolean;
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
  isPFLInput,
  readOnly,
  onChange
}: TStripInputProps) => {
  const [localValue, setLocalValue] = useState<string>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useMemo(
    () =>
      debounce((value: string) => {
        onChange(value);
      }, 500),
    [onChange]
  );

  const handleChange = (val: string) => {
    if (!isPFLInput) {
      setLocalValue(val);
      debouncedOnChange(val);
    }
  };

  return (
    <div className="w-full px-4 items-center">
      <input
        readOnly={readOnly}
        type="text"
        maxLength={15}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className={`w-full bg-label-field text-black g-transparent outline-none text-center py-1 text-sm rounded mb-1 truncate overflow-hidden whitespace-nowrap px-2`}
      />
    </div>
  );
};
