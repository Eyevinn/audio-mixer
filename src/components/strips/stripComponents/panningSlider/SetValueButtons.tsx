export const SetValueButtons = ({
  onChange
}: {
  onChange: (value: number) => void;
}) => {
  const valueButton = () => {
    const inputs = [
      { value: 0, position: 'left-[-2px]' },
      { value: 64, position: 'right-[27px]' },
      { value: 128, position: 'right-[-7px]' }
    ];
    return inputs.map((input: { value: number; position: string }) => (
      <button
        key={input.value}
        type="button"
        className={`absolute bottom-[-7px] ${input.position} w-[20px] h-[20px] hover:bg-almost-white rounded-md hover:opacity-10`}
        onClick={() => {
          onChange(input.value);
        }}
      />
    ));
  };

  return <div className="flex flex-row">{valueButton()}</div>;
};
