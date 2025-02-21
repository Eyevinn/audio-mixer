import React, { useState } from 'react';
import { PrimaryButton } from '../ui/buttons/Buttons';
import { Input } from '../ui/input/Input';
import { useWebSocket } from '../../context/WebSocketContext';

const WS_URL = process.env.REACT_APP_WS_URL;

export const WebSocketDialog = () => {
  const [address, setAddress] = useState<string>(
    WS_URL || 'ws://localhost:8000'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { connect, connectionFailed } = useWebSocket();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleConnect = (address: string) => {
    if (!address) {
      setErrorMessage('WebSocket URL is required.');
      return;
    }

    if (connectionFailed) {
      setErrorMessage('Connection failed. Please try again.');
    }
    connect(address);
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
        className="w-full p-2 rounded"
        onChange={handleInputChange}
        value={address}
        onKeyDown={handleKeyDown}
      />
      {!!errorMessage && (
        <p className="text-delete text-sm mt-2">{errorMessage}</p>
      )}
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
