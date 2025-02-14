import React from 'react';

type TButtonProps = {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

type TActionButtonProps = {
  label: string;
  buttonColor: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const CancelButton = ({
  onClick,
  children,
  className,
  disabled
}: TButtonProps) => {
  return (
    <button
      className={`${className} cursor-pointer text-sm ${disabled ? 'cursor-auto bg-button-abort/50 text-black/50' : 'cursor-pointer text-black bg-button-abort hover:bg-button-abort-hover'} font-bold py-2 px-4 rounded h-fit w-fit`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const PrimaryButton = ({
  onClick,
  children,
  className,
  disabled
}: TButtonProps) => {
  return (
    <button
      className={`${className} ${disabled ? 'cursor-auto bg-button-green/50 text-white/50' : 'cursor-pointer text-white bg-button-green hover:bg-button-green-hover'} cursor-pointer text-sm font-bold py-2 px-4 rounded h-fit w-fit`}
      disabled={disabled}
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
      className={`relative w-[61px] h-[40px] text-[15px] border-none bg-dark-grey text-center
        m-[5px_0_0_10px] p-0 rounded-[5px] text-white ${buttonColor}`}
      id={label.toLowerCase()}
      data-buttonstate="0"
      onClick={(e) => {
        onClick(e);
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <b>{label}</b>
    </button>
  );
};

export const DeleteButton = ({
  onClick,
  children,
  className,
  disabled
}: TButtonProps) => {
  return (
    <button
      className={`${className} ${disabled ? 'cursor-auto bg-button-delete/50 text-white/50' : 'cursor-pointer text-white bg-button-delete hover:bg-button-delete-hover'} font-bold py-2 px-4 rounded h-fit w-fit text-sm`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
