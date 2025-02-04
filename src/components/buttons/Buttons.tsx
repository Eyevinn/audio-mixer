type TButtonProps = {
  onClick: () => void;
  children?: React.ReactNode;
};

type TActionButtonProps = {
  label: string;
  buttonColor: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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

export const ActionButton = ({
  label,
  buttonColor,
  onClick
}: TActionButtonProps) => {
  return (
    <button
      className={`relative w-[61px] h-[40px] text-[15px] border-none bg-darkgrey text-center
        m-[5px_10px] p-0 rounded-[5px] text-white ${buttonColor}`}
      id={label.toLowerCase()}
      data-buttonstate="0"
      onClick={(e) => {
        onClick(e);
      }}
    >
      <b>{label}</b>
    </button>
  );
};
