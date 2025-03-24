import React from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import { WebSocketDialog } from './WebSocketDialog';
import { usePFLMixManager } from '../../hooks/usePFLMixManager';

export const WebSocketLogOn = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useWebSocket();
  usePFLMixManager();

  return (
    <div className="text-white text-2xl ">
      {!isConnected && <WebSocketDialog />}
      <div
        className={`${!isConnected ? 'pointer-events-none fixed w-full h-full bg-black opacity-80 z-30' : 'bg-zinc-900 min-h-screen flex'}`}
      >
        {children}
      </div>
    </div>
  );
};
