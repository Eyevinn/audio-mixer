type TButtonProps = {
  onClick: () => void;
  children?: React.ReactNode;
};

export const CancelButton = ({ onClick, children }: TButtonProps) => {
  return (
    <button
      className="bg-stone-100 hover:bg-stone-200 text-black font-bold py-2 px-4 rounded h-fit w-fit"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const PrimaryButton = ({ onClick, children }: TButtonProps) => {
  return (
    <button
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded h-fit w-fit"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
