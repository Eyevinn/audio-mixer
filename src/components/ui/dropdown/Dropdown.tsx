type TStripDropdownProps = {
  type?: string;
  options: string[];
  value: string;
  hidden?: boolean;
  configMode?: boolean;
  isStereo?: boolean | undefined;
  dropdownType?: 'settings';
  msStereo?: boolean;
  onChange: (input: string) => void;
};

export const StripDropdown = ({
  type,
  options,
  value,
  hidden,
  configMode,
  isStereo,
  dropdownType,
  msStereo,
  onChange
}: TStripDropdownProps) => {
  return (
    <div
      className={
        dropdownType !== 'settings'
          ? `
            flex justify-between items-center px-4 py-1 w-full
            ${configMode ? 'bg-selected-mix-bg border border-selected-mix-border border-y-0' : ''}
            ${msStereo ? 'text-xs' : 'text-sm'}
          `
          : 'mb-2 text-sm'
      }
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
        disabled={isStereo !== undefined ? !isStereo : false}
        className={
          dropdownType !== 'settings'
            ? `
              rounded
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
