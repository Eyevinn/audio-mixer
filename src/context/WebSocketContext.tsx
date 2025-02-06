import React, { createContext, useContext, useState } from 'react';
import { showError, showInfo } from '../utils/notifications';

interface WebSocketContextType {
  // Todo: define the message type
  wsUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendMessage: (message: any) => void;
  isConnected: boolean;
  connect: (address: string) => void;
  lastMessage: string | null;
  connectionFailed?: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string>('');
  const [connectionFailed, setConnectionFailed] = useState<boolean>(false);

  const connect = (address: string) => {
    try {
      setWsUrl(address);
      const websocket = new WebSocket(address);

      websocket.onmessage = (event) => {
        setLastMessage(event.data);
        try {
          const jsonData = JSON.parse(event.data);
          if ('error' in jsonData) {
            showError(
              `${jsonData.type} error for ${jsonData.resource}: ${jsonData.error}`
            );
          }
        } catch (error) {
          showError('Failed to parse WebSocket message');
          console.error('Parse error:', error);
        }
      };

      websocket.onerror = () => {
        showError(`Websocket connection to ${address} failed`);
        setConnectionFailed(true);
        setWsUrl('');
        setConnectionFailed(true);
        setIsConnected(false);
      };

      websocket.onopen = () => {
        showInfo('Websocket is connected');
        setIsConnected(true);
      };

      websocket.onclose = () => {
        showError(`Websocket connection to ${address} was closed`);
        setIsConnected(false);
        setWsUrl('');
      };

      setWs(websocket);
    } catch (error) {
      showError(`Failed to create WebSocket connection: ${error}`);
    }
  };

  const sendMessage = (message: Record<string, unknown>) => {
    if (!ws) {
      showError('Websocket is not connected yet!');
      return;
    }

    if (ws.readyState !== WebSocket.OPEN) {
      showError('Websocket lost connection');
      setIsConnected(false);
      return;
    }

    const messageString = JSON.stringify(message);
    ws.send(messageString);
  };

  return (
    <WebSocketContext.Provider
      value={{
        wsUrl,
        sendMessage,
        isConnected,
        connect,
        lastMessage,
        connectionFailed
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
