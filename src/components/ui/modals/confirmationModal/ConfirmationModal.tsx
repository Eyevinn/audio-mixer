import React, { useCallback, useEffect } from 'react';
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
  isDeletingAll?: boolean;
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
  isDeletingAll,
  onConfirm,
  onConfirmMixConfig,
  onClose
}) => {
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    if (isConfiguringMix && input && onConfirmMixConfig) {
      onConfirmMixConfig(input);
    } else if (onConfirm) {
      onConfirm();
    }
    onClose();
  }, [isConfiguringMix, input, onConfirmMixConfig, onConfirm, onClose]);

  const handleOutsideClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (isDeletingAll) {
          return;
        }
        handleConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleConfirm, isDeletingAll]);

  if (!isOpen) {
    return null;
  }

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
