type TStripDropdownProps = {
  type?: string;
  options: string[];
  value: string;
  hidden?: boolean;
  configMode?: boolean;
  onChange: (input: string) => void;
};

export const StripDropdown = ({
  type,
  options,
  value,
  hidden,
  configMode,
  onChange
}: TStripDropdownProps) => {
  return (
    <div
      className={`${configMode ? 'bg-selected-mix-bg border border-selected-mix-border border-y-0' : ''} flex justify-between text-sm items-center px-4 py-1 w-full`}
    >
      {type && (
        <label
          htmlFor={type}
          className={hidden ? 'text-strip-bg' : 'text-white'}
        >
          {type}
        </label>
      )}
      <select
        id={type}
        value={value.toLowerCase()}
        onChange={(e) => onChange(e.target.value)}
        className={`${type ? 'w-fit' : 'w-full'} px-2 py-1  text-sm rounded ${hidden ? 'text-strip-bg bg-strip-bg cursor-grab' : 'bg-input-field text-black cursor-pointer'}`}
      >
        {options.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {option
              .split('_')
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(' ')}
          </option>
        ))}
      </select>
    </div>
  );
};
