import React, { useState } from 'react';
import { PrimaryButton } from '../ui/buttons/Buttons';
import { Input } from '../ui/input/Input';

interface WebSocketDialogProps {
  onConnect: (address: string) => void;
  connectionFailed?: boolean;
}

export const WebSocketDialog: React.FC<WebSocketDialogProps> = ({
  onConnect,
  connectionFailed
}) => {
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    if (error) {
      setError(false);
      setErrorMessage('');
    }
  };

  const handleConnect = (address: string) => {
    if (!address) {
      setError(true);
      setErrorMessage('WebSocket URL is required.');
      return;
    }

    if (connectionFailed) {
      setError(true);
      setErrorMessage('Connection failed. Please try again.');
    }
    onConnect(address);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConnect(address);
    }
  };

  return (
    <dialog
      open
      className="md:min-w-[400px] fixed inset-0 items-center justify-center z-50 bg-modal-bg text-white p-8 rounded-lg border-2 border-border-bg"
    >
      <h2 className="text-xl mb-4">Connect to WebSocket</h2>
      <Input
        type="text"
        placeholder="ws://localhost:8000"
        className="w-full p-2 rounded"
        onChange={handleInputChange}
        value={address}
        error={error}
        onKeyDown={handleKeyDown}
      />
      {!!error && <p className="text-delete text-sm mt-2">{errorMessage}</p>}
      <div className="mt-4 justify-end flex">
        <PrimaryButton
          onClick={() => {
            handleConnect(address);
          }}
        >
          Connect
        </PrimaryButton>
      </div>
    </dialog>
  );
};
