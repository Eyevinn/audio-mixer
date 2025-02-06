type TInputProps = {
  className?: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
