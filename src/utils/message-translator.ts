import {
  OutputSamplingData,
  StripsSamplingData
} from '../context/SamplingDataContext';
import { TAudioStrip, TBaseStrip, TMixStrip, TOutput } from '../types/types';
import deepMerge from './deep-merge';
import logger from './logger';

//TODO rewrite these update functions
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

//TODO rewrite these update functions
function updateData<T extends TBaseStrip>(
  prevStrips: T[],
  oldStrips: Record<string, T>
): T[] {
  const oldStripsKeys = Object.keys(oldStrips);
  const isNewStrip =
    oldStripsKeys.length === 1 &&
    !prevStrips.find(
      (prevStrip) => prevStrip.stripId.toString() === oldStripsKeys[0]
    );
  if (isNewStrip) {
    let insertIndex = prevStrips.findIndex(
      (prevStrip) => prevStrip.stripId > parseInt(oldStripsKeys[0])
    );
    if (insertIndex < 0) {
      insertIndex = prevStrips.length;
    }
    const prevStripsCopy = JSON.parse(JSON.stringify(prevStrips));
    prevStripsCopy.splice(insertIndex, 0, {
      ...oldStrips[oldStripsKeys[0]],
      stripId: parseInt(oldStripsKeys[0])
    });
    return prevStripsCopy;
  }
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
  subscribe: () => void,
  getStripByIndex: (index: number) => void,
  getMixByIndex: (index: number) => void,
  setStrips: React.Dispatch<React.SetStateAction<TAudioStrip[]>>,
  setMixes: React.Dispatch<React.SetStateAction<TMixStrip[]>>,
  setOutputs: React.Dispatch<React.SetStateAction<{ [key: string]: TOutput }>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setStripsSamplingData: React.Dispatch<
    React.SetStateAction<StripsSamplingData>
  >,
  setMixesSamplingData: React.Dispatch<
    React.SetStateAction<StripsSamplingData>
  >,
  setOutputsSamplingData: React.Dispatch<
    React.SetStateAction<OutputSamplingData>
  >
) => {
  if (!message || !setStrips) return;
  try {
    const data = JSON.parse(message);
    // if (data.type !== 'sampling-update') logger.red(message);
    if (data.actor === 'self') return;
    logger.data(
      data.type,
      data.resource || data.event,
      data.body || data.result || data.address || 'No message'
    );
    switch (data.type) {
      case 'get-response': {
        if (data.resource === '/audio/strips') {
          setStrips((prevStrips) => mapData(data.body, prevStrips));
        }
        if (data.resource === '/audio/mixes') {
          setMixes((prevMixes) => mapData(data.body, prevMixes));
        }
        if (data.resource === '/audio/outputs') {
          setOutputs(data.body);
        }
        const resourceArray = data.resource?.split('/');
        const resourceType = resourceArray[2];
        const resourceIndex = resourceArray[3];
        if (resourceArray?.length === 4) {
          if (resourceType === 'strips') {
            setStrips((prevStrips: TAudioStrip[]) =>
              updateData(prevStrips, { [resourceIndex]: data.body })
            );
          } else if (resourceType === 'mixes') {
            setMixes((prevMixes: TMixStrip[]) =>
              updateData(prevMixes, { [resourceIndex]: data.body })
            );
          }
        }
        break;
      }
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
        if (data.body?.outputs) {
          setOutputs((prevOutputs) => {
            return deepMerge(prevOutputs, data.body.outputs);
          });
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
          subscribe();
        }
        break;

      case 'state-add': {
        const resourceArray = data.body?.resource?.split('/') || [];
        const resourceType = resourceArray[1];
        const resourceIndex = resourceArray[2];
        if (resourceType && resourceIndex) {
          if (resourceType === 'strips') getStripByIndex(resourceIndex);
          else if (resourceType === 'mixes') getMixByIndex(resourceIndex);
        }
        break;
      }

      case 'state-remove': {
        const resourceArray = data.body?.resource?.split('/') || [];
        const resourceType = resourceArray[1];
        const resourceIndex = resourceArray[2];
        const resourceCommand = resourceArray[3];
        const resourceCommandType = resourceArray[4];
        const resourceCommandIndex = resourceArray[5];
        const band = resourceArray[6];
        if (resourceCommand === 'filters' && resourceCommandType === 'eq') {
          const updateFunc = resourceType === 'strips' ? setStrips : setMixes;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          updateFunc((prevStrips: any) =>
            prevStrips.map((prevStrip: TAudioStrip | TMixStrip) => {
              if (prevStrip.stripId.toString() === resourceIndex) {
                const stripCopy: TAudioStrip | TMixStrip = JSON.parse(
                  JSON.stringify(prevStrip)
                );
                if (stripCopy.filters?.eq?.bands?.[band])
                  delete stripCopy.filters?.eq?.bands?.[band];
                return stripCopy;
              }
              return prevStrip;
            })
          );
        } else if (resourceType === 'strips') {
          setStrips((prevStrips) =>
            prevStrips.filter(
              (prevStrip) => prevStrip.stripId.toString() !== resourceIndex
            )
          );
        } else if (resourceType === 'mixes') {
          if (resourceCommand === 'inputs') {
            setMixes((prevMixes: TMixStrip[]) =>
              prevMixes.map((prevMix) => {
                if (prevMix.stripId.toString() === resourceIndex) {
                  const updatedMix = prevMix;
                  delete updatedMix.inputs[
                    resourceCommandType as 'mixes' | 'strips'
                  ][resourceCommandIndex];
                  return updatedMix;
                }
                return prevMix;
              })
            );
          } else {
            setMixes((prevStrips) =>
              prevStrips.filter(
                (prevStrip) => prevStrip.stripId.toString() !== resourceIndex
              )
            );
          }
        }
        break;
      }
      case 'command-response':
        if (!data.body && data.error) {
          if (
            (data.error.includes('already exists') &&
              data.resource.includes('/audio/mixes/1000/inputs/')) ||
            data.error.includes('1000 already exists')
          )
            return;
          setErrorMessage(data.error);
        }
        break;
      case 'set-response':
        if (!data.body && data.error) {
          setErrorMessage(data.error);
        }
        break;
      case 'sampling-update':
        if (data.resource === '/audio/strips/*/pre_fader_meter/*') {
          setStripsSamplingData(data.body.audio?.strips);
        }
        if (data.resource === '/audio/mixes/*/pre_fader_meter/*') {
          setMixesSamplingData(data.body.audio?.mixes);
        }
        if (data.resource === '/audio/outputs/*/meters/*') {
          setOutputsSamplingData(data.body.audio?.outputs);
        }
        break;
    }
  } catch (error) {
    console.error('Error processing WebSocket message:', error);
  }
};

export default messageTranslator;
