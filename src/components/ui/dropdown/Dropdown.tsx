import React from 'react';

type TStripDropdownProps = {
  type: string;
  options: string[];
  value: string;
  hidden?: boolean;
  onChange: (input: string) => void;
};

export const StripDropdown = ({
  type,
  options,
  value,
  hidden,
  onChange
}: TStripDropdownProps) => {
  return (
    <div className="flex justify-between text-sm items-center px-4 py-1">
      <label htmlFor={type} className={hidden ? 'text-strip-bg' : 'text-white'}>
        {type}
      </label>
      <select
        id={type}
        value={value.toLowerCase()}
        onChange={(e) => onChange(e.target.value)}
        className={`w-fit px-2 py-1  text-sm rounded ${hidden ? 'text-strip-bg bg-strip-bg' : 'bg-input-field text-black'}`}
      >
        {options.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
