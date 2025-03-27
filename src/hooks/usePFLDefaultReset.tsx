import { useEffect, useMemo } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useWebSocket } from '../context/WebSocketContext';
import { usePFLMix } from './usePFLMix';

export const usePFLDefaultReset = () => {
  const { mixes } = useGlobalState();
  const { sendMessage } = useWebSocket();
  const { setPFLStripMuted } = usePFLMix();
  const isPFL = useMemo(() => mixes?.find((m) => m.stripId === 1000), [mixes]);

  useEffect(() => {
    if (!isPFL) return;
    // Combined logic for both mixes and strips
    interface inputType {
      type: 'mixes' | 'strips';
      data: {
        [id: number]: {
          muted: boolean;
          volume: number;
          origin: 'pre_fader' | 'post_fader';
        };
      };
    }
    const inputTypes: inputType[] = [
      { type: 'mixes', data: isPFL.inputs?.mixes },
      { type: 'strips', data: isPFL.inputs?.strips }
    ];

    inputTypes.forEach(({ type, data }) => {
      if (!data) return;

      Object.entries(data).forEach(([key, value]) => {
        if (value.origin === 'post_fader') {
          setPFLStripMuted(type, Number(key), true);
          sendMessage({
            type: 'set',
            resource: `/audio/mixes/1000/inputs/${type}/${key}`,
            body: {
              muted: true,
              origin: 'pre_fader',
              volume: 1
            }
          });
        }
      });
    });
  }, [isPFL, sendMessage, setPFLStripMuted]);
};
