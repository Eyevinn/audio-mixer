import Icons from '../../../assets/icons/Icons';

interface ResetButtonProps {
  onClick: () => void;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <Icons
        name="IconReload"
        className="bg-button-abort text-black p-1 hover:cursor-pointer rounded hover:bg-button-abort-hover place-self-end w-8 h-8"
      />
    </button>
  );
};
