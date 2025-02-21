import React from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import { WebSocketDialog } from './WebSocketDialog';
import { useData } from '../../hooks/useData';

export const WebSocketLogOn = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useWebSocket();
  useData();

  return (
    <div className="text-white text-2xl">
      {!isConnected && <WebSocketDialog />}
      <div className="bg-zinc-900 min-h-screen flex">{children}</div>
    </div>
  );
};
