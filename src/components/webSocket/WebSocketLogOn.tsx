import React from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import { WebSocketDialog } from './WebSocketDialog';
import { usePFLMixManager } from '../../hooks/usePFLMixManager';
import { usePFLDefaultReset } from '../../hooks/usePFLDefaultReset';

export const WebSocketLogOn = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useWebSocket();
  usePFLMixManager();
  usePFLDefaultReset();

  return (
    <div className="text-white text-2xl ">
      {!isConnected && <WebSocketDialog />}
      <div
        className={`h-screen ${!isConnected ? 'pointer-events-none w-full bg-black opacity-80 z-30' : 'bg-zinc-900 flex'}`}
      >
        {children}
      </div>
    </div>
  );
};
