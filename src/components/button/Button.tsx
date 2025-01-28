type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded h-fit w-fit"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
