import Icons from '../../../assets/icons/Icons';

type StripHeaderProps = {
  label: string;
  copyButton?: boolean;
  onRemove: () => void;
};

export const StripHeader: React.FC<StripHeaderProps> = ({
  label,
  copyButton,
  onRemove
}) => {
  return (
    <div className="flex justify-between flex-wrap items-center w-full px-4 py-3">
      <div className="text-base text-center text-white">{label}</div>
      {copyButton && (
        <button onClick={onRemove} className="w-[2rem]">
          <Icons
            name="IconCopy"
            className="text-copy-btn rounded place-self-end hover:text-copy-btn-hover hover:cursor-pointer"
          />
        </button>
      )}
      <button onClick={onRemove} className="w-[2rem]">
        <Icons
          name="IconTrash"
          className="bg-button-delete p-1 hover:cursor-pointer rounded hover:bg-button-delete-hover place-self-end"
        />
      </button>
    </div>
  );
};
