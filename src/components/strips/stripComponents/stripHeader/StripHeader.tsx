import React, { useState } from 'react';
import Icons from '../../../../assets/icons/Icons';
import { TAudioStrip, TMixStrip } from '../../../../types/types';
import { ConfirmationModal } from '../../../ui/modals/confirmationModal/ConfirmationModal';

type StripHeaderProps = {
  header: string;
  label: string;
  isOutputStrip?: boolean;
  copyButton?: boolean;
  isRemovingFromMix?: boolean;
  removingOutputWarning?: string | string[];
  configMode?: boolean;
  onRemove?: () => void;
  onRemoveFromMix?: (input: TAudioStrip | TMixStrip) => void;
  onCopy?: () => void;
};

export const StripHeader: React.FC<StripHeaderProps> = ({
  header,
  label,
  isOutputStrip,
  copyButton,
  isRemovingFromMix,
  removingOutputWarning,
  configMode,
  onRemove,
  onRemoveFromMix,
  onCopy
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div
      className={`flex justify-between flex-wrap items-center w-full px-4 py-3`}
    >
      <div
        className={`${copyButton ? 'max-w-[5rem]' : 'max-w-[7rem]'} text-base text-center text-white truncate`}
        title={header}
      >
        {header}
      </div>
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
            name={`${configMode ? 'IconMinus' : 'IconTrash'}`}
            className="bg-button-delete p-1 hover:cursor-pointer rounded hover:bg-button-delete-hover place-self-end"
          />
        </button>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        title={`${isRemovingFromMix ? 'Remove' : 'Delete'} ${header}: ${label}`}
        message={`${removingOutputWarning && removingOutputWarning.length > 0 ? removingOutputWarning + '\n' : ''}Are you sure you want to ${isRemovingFromMix ? `remove ${label} from this mix?` : `delete ${label}?`}`}
        confirmText={`Yes, ${isRemovingFromMix ? 'remove' : 'delete'}`}
        onConfirm={onRemove}
        onConfirmMixConfig={onRemoveFromMix}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
