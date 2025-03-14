type TStripDropdownProps = {
  type?: string;
  options: string[];
  value: string;
  hidden?: boolean;
  isStereo?: boolean | undefined;
  dropdownType?: 'settings';
  msStereo?: boolean;
  disabled?: boolean;
  disabled?: boolean;
  onChange: (input: string) => void;
};

export const StripDropdown = ({
  type,
  options,
  value,
  hidden,
  isStereo,
  dropdownType,
  msStereo,
  disabled,
  disabled,
  onChange
}: TStripDropdownProps) => {
  return (
    <div
      className={`
        ${disabled ? 'pointer-events-none' : ''}
        ${
          dropdownType !== 'settings'
            ? `
            flex justify-between items-center px-4 py-1 w-full
            ${msStereo || !isStereo ? 'text-xs' : 'text-sm'}
          `
            : 'mb-2 text-sm'
        }
      `}
    >
      {type && (
        <label
          htmlFor={type}
          className={
            dropdownType !== 'settings'
              ? hidden
                ? 'text-strip-bg'
                : 'text-white pr-4'
              : 'w-[150px] inline-block'
          }
        >
          {type}
        </label>
      )}
      <select
        id={type}
        value={value.toLowerCase()}
        onChange={(e) => onChange(e.target.value)}
        className={
          dropdownType !== 'settings'
            ? `
              rounded
              ${isOutputStrip ? 'bg-modal-bg border-2 border-border-bg text-white px-4 py-2 rounded-lg' : ''}
              ${type ? 'w-fit' : 'w-full'}
              ${hidden ? 'text-strip-bg bg-strip-bg cursor-grab' : 'bg-input-field text-black cursor-pointer'}
              ${msStereo ? 'text-xs px-1 py-[5px]' : 'text-sm px-2 py-1'}
            `
            : 'bg-gray-700 rounded px-2 py-1'
        }
      >
        {options.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {option
              .split('_')
              .map((word) => {
                if (word.toLowerCase() === 'm/s') {
                  return 'M/S';
                }
                return (
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
              })
              .join(' ')}
          </option>
        ))}
      </select>
    </div>
  );
};
