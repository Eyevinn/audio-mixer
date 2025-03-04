import { useEffect } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useWebSocket } from '../context/WebSocketContext';
import { TAudioStrip, TBaseStrip, TMixStrip } from '../types/types';
import Logger from '../utils/logger';
import {
  getAllMixes,
  getAllOutputs,
  getAllStrips,
  resync
} from '../utils/wsCommands';
import deepMerge from '../utils/deep-merge';
export const useData = () => {
  const { sendMessage, messages, setMessages } = useWebSocket();
  const { setStrips, setMixes, setOutputs, setErrorMessage } = useGlobalState();

  function mapData<T extends TBaseStrip>(
    data: Record<string, T>,
    existingStrips: T[]
  ): T[] {
    return Object.entries(data).map(([index, stripData]) => {
      const strip = stripData as T;
      const existingStrip = existingStrips.find(
        (s) => s.stripId === parseInt(index)
      );

      return {
        ...existingStrip,
        ...strip,
        // TODO: Redo the stripId to be a uniquestring
        // stripId: 'Strip#' + index,
        stripId: parseInt(index),
        label: index === '1000' ? 'PFL' : (strip.label ?? existingStrip?.label)
      };
    });
  }

  function updateData<T extends TBaseStrip>(
    prevStrips: T[],
    oldStrips: T[]
  ): T[] {
    return prevStrips.map((strip) => {
      const newStrip = oldStrips[strip.stripId];
      if (newStrip) {
        return {
          ...strip,
          ...Object.keys(newStrip).reduce((acc, key) => {
            const typedKey = key as keyof T;
            const updatedValue = newStrip[typedKey];
            const currentValue = strip[typedKey];
            if (
              typeof updatedValue === 'object' &&
              updatedValue !== null &&
              currentValue &&
              typeof currentValue === 'object'
            ) {
              return {
                ...acc,
                [typedKey]: deepMerge(currentValue, updatedValue)
              };
            }
            return {
              ...acc,
              [typedKey]: updatedValue
            };
          }, {} as Partial<T>)
        } satisfies T;
      }
      return strip;
    });
  }

  useEffect(() => {
    if (messages.length === 0 || !sendMessage || !setStrips) return;

    const latestMessage = messages[0];
    setMessages((prevMessages) => prevMessages.slice(1));

    try {
      const data = JSON.parse(latestMessage);
      Logger.data(
        data.type,
        data.resource || data.event,
        data.body || data.result || data.address || 'No message'
      );
      switch (data.type) {
        case 'get-response':
          if (data.resource === '/audio/strips') {
            setStrips((prevStrips) => mapData(data.body, prevStrips));
          }
          if (data.resource === '/audio/mixes') {
            setMixes((prevMixes) => mapData(data.body, prevMixes));
          }
          if (data.resource === '/audio/outputs') {
            setOutputs(data.body);
          }
          break;

        case 'state-change':
          if (data.body?.strips) {
            setStrips((prevStrips: TAudioStrip[]) =>
              updateData(prevStrips, data.body?.strips)
            );
          }
          if (data.body?.mixes) {
            setMixes((prevMixes: TMixStrip[]) =>
              updateData(prevMixes, data.body?.mixes)
            );
          }
          break;

        case 'subscribe-response':
          if (data.body?.strips) {
            setStrips((prevStrips) => mapData(data.body.strips, prevStrips));
          }
          if (data.body?.mixes) {
            setMixes((prevMixes) => mapData(data.body.mixes, prevMixes));
          }
          if (data.body?.outputs) {
            setOutputs(data.body.outputs);
          }
          break;

        case 'event':
          if (data.event === 'connect') {
            resync(sendMessage);
          }
          break;

        case 'state-add':
          if (
            data.body.resource.startsWith('/audio/mixes/1000/inputs/mixes/') ||
            data.body.resource.startsWith('/audio/mixes/1000/inputs/strips/')
          ) {
            sendMessage({
              type: 'set',
              resource: data.body.resource,
              body: {
                muted: true,
                origin: 'pre_fader'
              }
            });
          }
          getAllStrips(sendMessage);
          getAllMixes(sendMessage);
          break;

        case 'state-remove':
          if (data.body.resource.startsWith('/strips/')) {
            getAllStrips(sendMessage);
          }
          if (data.body.resource.startsWith('/mixes/')) {
            getAllMixes(sendMessage);
          }
          break;
        case 'command-response':
          if (!data.body && data.error) {
            setErrorMessage(data.error);
          }
          break;
        case 'set-response':
          if (data.resource.includes('/audio/outputs')) {
            getAllOutputs(sendMessage);
          }
          if (!data.body && data.error) {
            setErrorMessage(data.error);
          }
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [
    messages,
    sendMessage,
    setStrips,
    setMixes,
    setOutputs,
    setErrorMessage,
    setMessages
  ]);
};
