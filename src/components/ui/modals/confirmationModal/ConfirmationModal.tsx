import React from 'react';
import { TAudioStrip, TMixStrip } from '../../../../types/types';
import { CancelButton, DeleteButton } from '../../buttons/Buttons';

interface ConfirmationModalProps {
  input?: TAudioStrip | TMixStrip;
  title: string;
  message: string;
  isOpen: boolean;
  errorMessage?: string | null;
  confirmText: string;
  isConfiguringMix?: boolean;
  onConfirm?: () => void;
  onConfirmMixConfig?: (input: TAudioStrip | TMixStrip) => void;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  input,
  title,
  message,
  isOpen,
  errorMessage,
  confirmText,
  isConfiguringMix,
  onConfirm,
  onConfirmMixConfig,
  onClose
}) => {
  if (!isOpen) {
    return null;
  }

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    if (isConfiguringMix && input && onConfirmMixConfig) {
      onConfirmMixConfig(input);
    } else {
      onConfirm && onConfirm();
    }
    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 whitespace-pre-line"
      onClick={handleOutsideClick}
    >
      <div className="bg-modal-bg border-2 border-border-bg rounded-lg py-8 px-12 shadow-lg">
        <h1 className="text-lg">{title}</h1>
        <p className="text-sm mt-2">{message}</p>
        {errorMessage && <p className="text-delete mt-4">{errorMessage}</p>}
        <div className="flex justify-between mt-4">
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          <DeleteButton onClick={handleConfirm}>{confirmText}</DeleteButton>
        </div>
      </div>
    </div>
  );
};
