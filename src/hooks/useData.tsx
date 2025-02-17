import { useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { TAudioStrip } from '../types/types';
import { resync, getAllStrips } from '../utils/utils';

export const useData = () => {
  const { sendMessage, lastMessage } = useWebSocket();
  const { setSavedStrips } = useGlobalState();

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
        fader: strip.fader ?? existingStrip?.fader,
        filters: strip.filters ?? existingStrip?.filters,
        input: strip.input ?? existingStrip?.input ?? undefined,
        inputs: strip.input ?? existingStrip?.input ?? undefined,
        input_meter: strip.input_meter ?? existingStrip?.input_meter,
        label: strip.label ?? existingStrip?.label,
        post_fader_meter:
          strip.post_fader_meter ?? existingStrip?.post_fader_meter,
        pre_fader_meter: strip.pre_fader_meter ?? existingStrip?.pre_fader_meter
      };
    });
  };

  useEffect(() => {
    if (!lastMessage || !sendMessage || !setSavedStrips) return;

    try {
      const data = JSON.parse(lastMessage);
      console.log('type', data.type);
      switch (data.type) {
        case 'get-response':
          console.log('get-response', data.body);
          if (data.resource === '/audio/strips') {
            setSavedStrips((prevStrips) =>
              mapStripsData(data.body, prevStrips)
            );
          }
          break;

        case 'state-change':
          console.log('state-change', data.body);
          if (data.body?.strips) {
            setSavedStrips((prevStrips: TAudioStrip[]) =>
              prevStrips.map((strip) => {
                const updatedStripData = data.body.strips[strip.stripId];
                if (updatedStripData) {
                  return {
                    ...strip,
                    ...Object.keys(updatedStripData).reduce((acc, key) => {
                      const typedKey = key as keyof TAudioStrip;
                      const updatedValue = updatedStripData[typedKey];
                      const currentValue = strip[typedKey];

                      if (
                        typeof updatedValue === 'object' &&
                        updatedValue !== null &&
                        currentValue &&
                        typeof currentValue === 'object'
                      ) {
                        return {
                          ...acc,
                          [typedKey]: {
                            ...(currentValue as Record<string, unknown>),
                            ...(updatedValue as Record<string, unknown>)
                          }
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
          break;

        case 'subscribe-response':
          if (data.body?.strips) {
            console.log('subscribe-response: ', data.body);
            setSavedStrips((prevStrips) =>
              mapStripsData(data.body.strips, prevStrips)
            );
          }
          break;

        case 'event':
          if (data.event === 'connect') {
            console.log('event -> connect', data.body);
            resync(sendMessage);
          }
          break;

        case 'state-add':
          console.log('state-add', data.body);
          getAllStrips(sendMessage);
          break;
        case 'state-remove':
          console.log('state-remove', data.body);
          break;
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [lastMessage, sendMessage, setSavedStrips]);
};
