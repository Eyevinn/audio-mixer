import React, { useState } from 'react';
import { TAudioStrip, TMixStrip } from '../../../../types/types';
import Icons from '../../../../assets/icons/Icons';
import { ConfirmationModal } from '../../../ui/modals/confirmationModal/ConfirmationModal';

type StripHeaderProps = {
  label: string;
  isOutputStrip?: boolean;
  copyButton?: boolean;
  isRemovingFromMix?: boolean;
  removingOutputWarning?: string | string[];
  onRemove?: () => void;
  onRemoveFromMix?: (input: TAudioStrip | TMixStrip) => void;
  onCopy?: () => void;
};

export const StripHeader: React.FC<StripHeaderProps> = ({
  label,
  isOutputStrip,
  copyButton,
  isRemovingFromMix,
  removingOutputWarning,
  onRemove,
  onRemoveFromMix,
  onCopy
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="flex justify-between flex-wrap items-center w-full px-4 py-3">
      <div className="text-base text-center text-white">{label}</div>
      {copyButton && (
        <button onClick={onCopy} className="w-[2rem]">
          <Icons
            name="IconCopy"
            className="text-copy-btn rounded place-self-end hover:text-copy-btn-hover hover:cursor-pointer"
          />
        </button>
      )}
      {!isOutputStrip && (
        <button onClick={() => setIsModalOpen(true)} className="w-[2rem]">
          <Icons
            name="IconTrash"
            className="bg-button-delete p-1 hover:cursor-pointer rounded hover:bg-button-delete-hover place-self-end"
          />
        </button>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        title={`Delete ${label}`}
        message={`${removingOutputWarning && removingOutputWarning.length > 0 ? removingOutputWarning + '\n' : ''}Are you sure you want to delete ${label}${isRemovingFromMix ? ' from this mix?' : '?'}`}
        confirmText="Yes, delete"
        onConfirm={onRemove}
        onConfirmMixConfig={onRemoveFromMix}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
