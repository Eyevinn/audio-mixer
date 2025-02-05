import { useWebSocket } from './WebSocketContext';
import { WebSocketDialog } from './WebSocketDialog';

export const WebSocketLogOn = ({ children }: { children: React.ReactNode }) => {
  const { isConnected, connect } = useWebSocket();
  return (
    <div className="text-white text-2xl">
      {!isConnected && <WebSocketDialog onConnect={connect} />}
      {children}
    </div>
  );
};
