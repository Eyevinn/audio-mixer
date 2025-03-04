import React, { createContext, useContext, useState } from 'react';
import { showError, showInfo } from '../utils/notifications';
import { AudioState } from '../types/types';
import logger from '../utils/logger';
import toast from 'react-hot-toast';
import { useGlobalState } from './GlobalStateContext';
import messageTranslator from '../utils/message-translator';

interface WebSocketContextType {
  wsUrl: string;
  sendMessage: (
    message: Record<string, unknown> | Record<string, unknown>[]
  ) => void;
  isConnected: boolean;
  connect: (address: string) => void;
  audioState?: AudioState;
  clearAudioState: () => void;
  connectionFailed?: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { setStrips, setMixes, setOutputs, setErrorMessage } = useGlobalState();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [audioState, setAudioState] = useState<AudioState | undefined>();
  const [wsUrl, setWsUrl] = useState<string>('');
  const [connectionFailed, setConnectionFailed] = useState<boolean>(false);

  function sendMessage(
    this: WebSocket,
    message: Record<string, unknown> | Record<string, unknown>[]
  ) {
    if (!this && !ws) {
      toast.error('Websocket is not connected', {
        duration: 3000,
        position: 'bottom-right'
      });
      return;
    }

    if ((this || ws).readyState !== WebSocket.OPEN) {
      toast.error('Websocket lost connection', {
        duration: 3000,
        position: 'bottom-right'
      });
      setIsConnected(false);
      return;
    }

    const messageString = JSON.stringify(message);
    (this || ws).send(messageString);
  }

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
            logger.data(jsonData.type, jsonData.resource, jsonData.body);
            setAudioState(jsonData);
          } else {
            messageTranslator(
              event.data,
              sendMessage.bind(websocket),
              setStrips,
              setMixes,
              setOutputs,
              setErrorMessage
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
        setWsUrl('');
        clearTimeout(connectionTimeout);
      };
      setWs(websocket);
    } catch (error) {
      showError(`Failed to create WebSocket connection: ${error}`);
    }
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
