type TButtonProps = {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
};

type TActionButtonProps = {
  label: string;
  buttonColor: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const CancelButton = ({
  onClick,
  children,
  className
}: TButtonProps) => {
  return (
    <button
      className={`${className} bg-button-abort hover:bg-button-abort-hover text-black font-bold py-2 px-4 rounded h-fit w-fit`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const PrimaryButton = ({
  onClick,
  children,
  className
}: TButtonProps) => {
  return (
    <button
      className={`${className} text-sm bg-button-green hover:bg-button-green-hover text-white font-bold py-2 px-4 rounded h-fit w-fit`}
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
        m-[5px_0_0_10px] p-0 rounded-[5px] text-white ${buttonColor}`}
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
