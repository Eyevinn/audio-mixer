import React, { useState } from 'react';
import Icons from '../../../assets/icons/Icons';
import { TAudioStrip, TMixStrip } from '../../../types/types';
import { ConfirmationModal } from '../../ui/modals/confirmationModal/ConfirmationModal';

type StripHeaderProps = {
  label: string;
  copyButton?: boolean;
  isRemovingFromMix?: boolean;
  onRemove?: () => void;
  onRemoveFromMix?: (input: TAudioStrip | TMixStrip) => void;
};

export const StripHeader: React.FC<StripHeaderProps> = ({
  label,
  copyButton,
  isRemovingFromMix,
  onRemove,
  onRemoveFromMix
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="flex justify-between flex-wrap items-center w-full px-4 py-3">
      <div className="text-base text-center text-white">{label}</div>
      {copyButton && (
        <button onClick={() => console.log('Should copy')} className="w-[2rem]">
          <Icons
            name="IconCopy"
            className="text-copy-btn rounded place-self-end hover:text-copy-btn-hover hover:cursor-pointer"
          />
        </button>
      )}
      <button onClick={() => setIsModalOpen(true)} className="w-[2rem]">
        <Icons
          name="IconTrash"
          className="bg-button-delete p-1 hover:cursor-pointer rounded hover:bg-button-delete-hover place-self-end"
        />
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        title={`Delete ${label}`}
        message={`Are you sure you want to delete ${label}${isRemovingFromMix ? ' from this mix?' : '?'}`}
        confirmText="Yes, delete"
        onConfirm={onRemove}
        onConfirmMixConfig={onRemoveFromMix}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
