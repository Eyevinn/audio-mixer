import Icons from '../../../assets/icons/Icons';

type StripHeaderProps = {
  label: string;
  onRemove: () => void;
};

export const StripHeader: React.FC<StripHeaderProps> = ({
  label,
  onRemove
}) => {
  return (
    <div className="flex justify-between flex-wrap items-center w-full px-4 py-3">
      <div className="text-base text-center text-white">{label}</div>
      <button onClick={onRemove} className="w-[2rem]">
        <Icons
          name="IconTrash"
          className="bg-button-delete p-1 hover:cursor-pointer rounded hover:bg-light place-self-end"
        />
      </button>
    </div>
  );
};
