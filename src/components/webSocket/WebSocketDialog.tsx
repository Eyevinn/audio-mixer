import React, { useEffect, useState } from 'react';
import { PrimaryButton } from '../ui/buttons/Buttons';
import { Input } from '../ui/input/Input';
import { useWebSocket } from '../../context/WebSocketContext';
import Loader from '../ui/loader/Loader';

const WS_URL = process.env.REACT_APP_WS_URL;

export const WebSocketDialog = () => {
  const [address, setAddress] = useState<string>(
    WS_URL || 'ws://localhost:8000'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { connect, connectionFailed } = useWebSocket();

  useEffect(() => {
    if (connectionFailed) {
      setLoading(false);
      setErrorMessage('Connection failed. Please try again.');
    } else {
      setErrorMessage('');
    }
  }, [connectionFailed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setLoading(false);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleConnect = (address: string) => {
    if (!address) {
      setErrorMessage('WebSocket URL is required.');
      return;
    }
    setLoading(true);
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
          className="min-w-24 max-w-24 max-h-10 min-h-10 flex justify-around"
        >
          {loading ? (
            <Loader />
          ) : (
            <span className="flex items-center">Connect</span>
          )}
        </PrimaryButton>
      </div>
    </dialog>
  );
};
