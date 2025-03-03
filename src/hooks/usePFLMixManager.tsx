import { useEffect, useRef } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useWebSocket } from '../context/WebSocketContext';
import { addMix, addMixToMix, addStripToMix } from '../utils/wsCommands';

export const usePFLMixManager = () => {
  const { mixes, strips } = useGlobalState();
  const { sendMessage } = useWebSocket();

  const processedStrips = useRef<Set<number>>(new Set());
  const processedMixes = useRef<Set<number>>(new Set());

  // Ensure PFL mix exists
  useEffect(() => {
    if (strips.length === 0) return;

    const pflMix = mixes.find((mix) => mix.stripId === 1000);
    if (!pflMix) {
      addMix(sendMessage, 1000);
    }
  }, [mixes, strips.length, sendMessage]);

  // Add new strips to PFL mix
  useEffect(() => {
    const pflMix = mixes.find((mix) => mix.stripId === 1000);
    if (!pflMix) return;

    strips.forEach((strip) => {
      if (strip.stripId === 1000 || processedStrips.current.has(strip.stripId))
        return;

      const isAlreadyInPFL =
        pflMix.inputs?.strips &&
        Object.keys(pflMix.inputs.strips).map(Number).includes(strip.stripId);

      if (!isAlreadyInPFL) {
        addStripToMix(sendMessage, 1000, strip.stripId);
      }

      processedStrips.current.add(strip.stripId);
    });
  }, [strips, mixes, sendMessage]);

  // Add new mixes to PFL mix
  useEffect(() => {
    const pflMix = mixes.find((mix) => mix.stripId === 1000);
    if (!pflMix) return;

    mixes.forEach((mix) => {
      if (mix.stripId === 1000 || processedMixes.current.has(mix.stripId))
        return;

      const isAlreadyInPFL =
        pflMix.inputs?.mixes &&
        Object.keys(pflMix.inputs.mixes).map(Number).includes(mix.stripId);

      if (!isAlreadyInPFL) {
        addMixToMix(sendMessage, 1000, mix.stripId);
      }

      processedMixes.current.add(mix.stripId);
    });
  }, [mixes, sendMessage]);
};
