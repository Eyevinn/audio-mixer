import React, { createContext, useContext, useState } from 'react';
import { showError, showInfo } from '../utils/notifications';
import { AudioState } from '../types/types';
import logger from '../utils/logger';
import toast from 'react-hot-toast';

interface WebSocketContextType {
  wsUrl: string;
  sendMessage: (
    message: Record<string, unknown> | Record<string, unknown>[]
  ) => void;
  isConnected: boolean;
  connect: (address: string) => void;
  messages: string[];
  setMessages: React.Dispatch<React.SetStateAction<string[]>>;
  audioState?: AudioState;
  clearAudioState: () => void;
  connectionFailed?: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [audioState, setAudioState] = useState<AudioState | undefined>();
  const [wsUrl, setWsUrl] = useState<string>('');
  const [connectionFailed, setConnectionFailed] = useState<boolean>(false);

  const connect = (address: string) => {
    try {
      setConnectionFailed(false);
      setWsUrl(address);
      const websocket = new WebSocket(address);
      const connectionTimeout = setTimeout(() => {
        if (websocket.readyState !== WebSocket.OPEN) {
          websocket.close();
          setConnectionFailed(true);
        }
      }, 5000);

      websocket.onmessage = (event) => {
        try {
          const jsonData = JSON.parse(event.data);
          if ('error' in jsonData) {
            showError(
              `${jsonData.type} error for ${jsonData.resource}: ${jsonData.error}`
            );
          }
          if (
            jsonData.resource === '/audio' &&
            jsonData.type === 'get-response'
          ) {
            logger.data('Exporting', event.data);
            setAudioState(jsonData);
          } else {
            setMessages((prev) => [...prev, event.data]);
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
        setIsConnected(false);
        clearTimeout(connectionTimeout);
      };

      websocket.onopen = () => {
        showInfo('Websocket is connected');
        setIsConnected(true);
      };

      websocket.onclose = () => {
        showError(`Websocket connection to ${address} was closed`);
        setIsConnected(false);
        clearTimeout(connectionTimeout);
        setWsUrl('');
      };

      setWs(websocket);
    } catch (error) {
      showError(`Failed to create WebSocket connection: ${error}`);
    }
  };

  const sendMessage = (
    message: Record<string, unknown> | Record<string, unknown>[]
  ) => {
    if (!ws) {
      toast.error('Websocket is not connected', {
        duration: 3000,
        position: 'bottom-right'
      });
      return;
    }

    if (ws.readyState !== WebSocket.OPEN) {
      toast.error('Websocket lost connection', {
        duration: 3000,
        position: 'bottom-right'
      });
      setIsConnected(false);
      return;
    }

    const messageString = JSON.stringify(message);
    logger.black('SENDING:' + messageString);
    ws.send(messageString);
  };

  const clearAudioState = () => {
    setAudioState(undefined);
  };

  return (
    <WebSocketContext.Provider
      value={{
        wsUrl,
        sendMessage,
        isConnected,
        connect,
        messages,
        setMessages,
        audioState,
        clearAudioState,
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
