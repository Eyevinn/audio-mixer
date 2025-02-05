import React from 'react';

interface WebSocketDialogProps {
  onConnect: (address: string) => void;
}

export const WebSocketDialog: React.FC<WebSocketDialogProps> = ({
  onConnect
}) => {
  return (
    <dialog open className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl mb-4">Connect to WebSocket</h2>
      <input
        type="text"
        id="websocket_address"
        placeholder="ws://localhost:8000"
        className="w-full p-2 mb-4 bg-gray-700 rounded"
      />
      <button
        onClick={() => {
          const address = (
            document.getElementById('websocket_address') as HTMLInputElement
          ).value;
          onConnect(address);
        }}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        Connect
      </button>
    </dialog>
  );
};
