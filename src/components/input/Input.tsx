type InputProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input = ({ value, onChange }: InputProps) => {
  return (
    <input
      className="bg-zinc-600 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded h-fit w-fit"
      value={value}
      onChange={onChange}
    />
  );
};
