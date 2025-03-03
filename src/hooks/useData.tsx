/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useWebSocket } from '../context/WebSocketContext';
import { TAudioStrip, TMixStrip } from '../types/types';
import Logger from '../utils/logger';
import {
  getAllMixes,
  getAllOutputs,
  getAllStrips,
  resync
} from '../utils/utils';
export const useData = () => {
  const { sendMessage, messages, setMessages } = useWebSocket();
  const { setStrips, setMixes, setOutputs, setErrorMessage } = useGlobalState();

  const mapStripsData = (
    data: Record<string, TAudioStrip>,
    existingStrips: TAudioStrip[]
  ) => {
    return Object.entries(data).map(([index, stripData]) => {
      const strip = stripData as TAudioStrip;
      const existingStrip = existingStrips.find(
        (s) => s.stripId === parseInt(index)
      );

      return {
        selected: existingStrip?.selected ?? false,
        pfl: existingStrip?.pfl ?? false,
        stripId: parseInt(index),
        // TODO: Redo the stripId to be a uniquestring
        // stripId: 'Strip#' + index,
        fader: strip.fader ?? existingStrip?.fader,
        filters: strip.filters ?? existingStrip?.filters,
        input: strip.input ?? existingStrip?.input ?? undefined,
        input_meter: strip.input_meter ?? existingStrip?.input_meter,
        label: strip.label ?? existingStrip?.label,
        post_fader_meter:
          strip.post_fader_meter ?? existingStrip?.post_fader_meter,
        pre_fader_meter: strip.pre_fader_meter ?? existingStrip?.pre_fader_meter
      };
    });
  };

  const mapMixesData = (
    data: Record<string, TMixStrip>,
    existingStrips: TMixStrip[]
  ) => {
    return Object.entries(data).map(([index, stripData]) => {
      const strip = stripData as TMixStrip;
      const existingStrip = existingStrips.find(
        (s) => s.stripId === parseInt(index)
      );

      return {
        selected: existingStrip?.selected ?? false,
        pfl: existingStrip?.pfl ?? false,
        stripId: parseInt(index),
        // TODO: Redo the stripId to be a uniquestring
        // stripId: 'Mix#' + index, stripId.split('#')[1]
        fader: strip.fader ?? existingStrip?.fader,
        filters: strip.filters ?? existingStrip?.filters,
        inputs: strip.inputs ?? existingStrip?.inputs ?? undefined,
        input_meter: strip.input_meter ?? existingStrip?.input_meter,
        label: strip.label ?? existingStrip?.label,
        post_fader_meter:
          strip.post_fader_meter ?? existingStrip?.post_fader_meter,
        pre_fader_meter: strip.pre_fader_meter ?? existingStrip?.pre_fader_meter
      };
    });
  };

  useEffect(() => {
    if (messages.length === 0 || !sendMessage || !setStrips) return;

    const latestMessage = messages[0];
    setMessages((prevMessages) => prevMessages.slice(1));

    try {
      const data = JSON.parse(latestMessage);
      Logger.data('Type', data.type);
      Logger.data('Data', data);
      switch (data.type) {
        case 'get-response':
          Logger.data('Get-response', data.body);
          Logger.data('Resource', data.resource);
          if (data.resource === '/audio/strips') {
            setStrips((prevStrips) => mapStripsData(data.body, prevStrips));
          }
          if (data.resource === '/audio/mixes') {
            setMixes((prevMixes) => mapMixesData(data.body, prevMixes));
          }
          if (data.resource === '/audio/outputs') {
            setOutputs(data.body);
          }
          break;

        case 'state-change':
          Logger.data('State-change', data.body);
          if (data.body?.strips) {
            setStrips((prevStrips: TAudioStrip[]) =>
              prevStrips.map((strip) => {
                const updatedStripData = data.body.strips[strip.stripId];
                if (updatedStripData) {
                  return {
                    ...strip,
                    ...Object.keys(updatedStripData).reduce((acc, key) => {
                      const typedKey = key as keyof TAudioStrip;
                      const updatedValue = updatedStripData[typedKey];
                      const currentValue = strip[typedKey];

                      const deepMerge = (target: any, source: any): any => {
                        if (typeof source !== 'object' || source === null) {
                          return source;
                        }
                        if (typeof target !== 'object' || target === null) {
                          return source;
                        }

                        // Handle arrays specially
                        if (Array.isArray(source)) {
                          if (!Array.isArray(target)) return source;
                          return target.map((item, index) =>
                            index < source.length
                              ? deepMerge(item, source[index])
                              : item
                          );
                        }

                        const result = { ...target };
                        Object.keys(source).forEach((key) => {
                          // Special handling for eq.bands - treat as an object with numeric keys
                          if (
                            typeof source[key] === 'object' &&
                            source[key] !== null
                          ) {
                            if (
                              target[key] &&
                              !Array.isArray(target[key]) &&
                              !Array.isArray(source[key])
                            ) {
                              // If both are objects and not arrays, merge them
                              result[key] = deepMerge(target[key], source[key]);
                            } else {
                              // If one is not an object or they're arrays, replace with source
                              result[key] = source[key];
                            }
                          } else {
                            result[key] = source[key];
                          }
                        });
                        return result;
                      };

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
                    }, {} as Partial<TAudioStrip>)
                  } satisfies TAudioStrip;
                }
                return strip;
              })
            );
          }
          if (data.body?.mixes) {
            setMixes((prevMixes: TMixStrip[]) =>
              prevMixes.map((mix) => {
                const updatedStripData = data.body.mixes[mix.stripId];
                if (updatedStripData) {
                  return {
                    ...mix,
                    ...Object.keys(updatedStripData).reduce((acc, key) => {
                      const typedKey = key as keyof TMixStrip;
                      const updatedValue = updatedStripData[typedKey];
                      const currentValue = mix[typedKey];

                      const deepMerge = (target: any, source: any): any => {
                        if (typeof source !== 'object' || source === null) {
                          return source;
                        }
                        if (typeof target !== 'object' || target === null) {
                          return source;
                        }

                        // Handle arrays specially
                        if (Array.isArray(source)) {
                          if (!Array.isArray(target)) return source;
                          return target.map((item, index) =>
                            index < source.length
                              ? deepMerge(item, source[index])
                              : item
                          );
                        }

                        const result = { ...target };
                        Object.keys(source).forEach((key) => {
                          // Special handling for eq.bands - treat as an object with numeric keys
                          if (
                            typeof source[key] === 'object' &&
                            source[key] !== null
                          ) {
                            if (
                              target[key] &&
                              !Array.isArray(target[key]) &&
                              !Array.isArray(source[key])
                            ) {
                              // If both are objects and not arrays, merge them
                              result[key] = deepMerge(target[key], source[key]);
                            } else {
                              // If one is not an object or they're arrays, replace with source
                              result[key] = source[key];
                            }
                          } else {
                            result[key] = source[key];
                          }
                        });
                        return result;
                      };

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
                    }, {} as Partial<TMixStrip>)
                  } satisfies TMixStrip;
                }
                return mix;
              })
            );
          }
          break;

        case 'subscribe-response':
          if (data.body?.strips) {
            setStrips((prevStrips) =>
              mapStripsData(data.body.strips, prevStrips)
            );
          }
          if (data.body?.mixes) {
            setMixes((prevMixes) => mapMixesData(data.body.mixes, prevMixes));
          }
          if (data.body?.outputs) {
            setOutputs(data.body.outputs);
          }
          break;

        case 'event':
          if (data.event === 'connect') {
            Logger.data('Event -> connect', data.body);
            resync(sendMessage);
          }
          break;

        case 'state-add':
          Logger.data('State-add', data.body);
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
          Logger.data('Data-resource', data.resource);
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
