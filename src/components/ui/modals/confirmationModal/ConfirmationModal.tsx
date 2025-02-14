import React from 'react';
import { DeleteButton, CancelButton } from '../../buttons/Buttons';

interface ConfirmationModalProps {
  title: string;
  message: string;
  isOpen: boolean;
  errorMessage?: string | null;
  confirmText: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  isOpen,
  errorMessage,
  confirmText,
  onConfirm,
  onClose
}) => {
  if (!isOpen) {
    return null;
  }

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-modal-bg border-2 border-border-bg rounded-lg p-8 shadow-lg">
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
