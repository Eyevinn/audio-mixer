import { useEffect, useMemo } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useWebSocket } from '../context/WebSocketContext';

export const usePFLDefaultReset = () => {
  const { savedMixes } = useGlobalState();
  const { sendMessage } = useWebSocket();
  const isPFL = useMemo(
    () => savedMixes?.find((m) => m.stripId === 1000),
    [savedMixes]
  );

  useEffect(() => {
    if (!isPFL) return;

    Object.entries(isPFL.inputs?.mixes).forEach(([key, value]) => {
      if (value.origin === 'post_fader') {
        sendMessage({
          type: 'set',
          resource: `/audio/mixes/1000/inputs/mixes/${key}`,
          body: {
            muted: true,
            origin: 'pre_fader'
          }
        });
      }
    });
  }, [isPFL, sendMessage]);

  useEffect(() => {
    if (!isPFL) return;

    Object.entries(isPFL.inputs?.strips).forEach(([key, value]) => {
      if (value.origin === 'post_fader') {
        sendMessage({
          type: 'set',
          resource: `/audio/mixes/1000/inputs/strips/${key}`,
          body: {
            muted: true,
            origin: 'pre_fader'
          }
        });
      }
    });
  }, [isPFL, sendMessage]);
};
