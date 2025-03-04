import { Output, TAudioStrip, TBaseStrip, TMixStrip } from '../types/types';
import deepMerge from './deep-merge';
import logger from './logger';
import { getAllMixes, getAllOutputs, getAllStrips, resync } from './wsCommands';

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

const messageTranslator = (
  message: string,
  sendMessage: (
    message: Record<string, unknown> | Record<string, unknown>[]
  ) => void,
  setStrips: React.Dispatch<React.SetStateAction<TAudioStrip[]>>,
  setMixes: React.Dispatch<React.SetStateAction<TMixStrip[]>>,
  setOutputs: React.Dispatch<React.SetStateAction<{ [key: string]: Output }>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!message || !sendMessage || !setStrips) return;
  try {
    const data = JSON.parse(message);
    logger.data(
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
        getAllMixes(sendMessage);
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
};

export default messageTranslator;
