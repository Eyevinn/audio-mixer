import { useEffect, useRef } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { addMix, addMixToMix, addStripToMix } from '../utils/utils';
import { useWebSocket } from '../context/WebSocketContext';

export const usePFLMixManager = () => {
  const { savedMixes, savedStrips } = useGlobalState();
  const { sendMessage } = useWebSocket();

  const processedStrips = useRef<Set<number>>(new Set());
  const processedMixes = useRef<Set<number>>(new Set());

  // Ensure PFL mix exists
  useEffect(() => {
    if (savedStrips.length === 0) return;

    const pflMix = savedMixes.find((mix) => mix.stripId === 1000);
    if (!pflMix) {
      addMix(sendMessage, 1000);
    }
  }, [savedMixes, savedStrips.length, sendMessage]);

  // Add new strips to PFL mix
  useEffect(() => {
    const pflMix = savedMixes.find((mix) => mix.stripId === 1000);
    if (!pflMix) return;

    savedStrips.forEach((strip) => {
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
  }, [savedStrips, savedMixes, sendMessage]);

  // Add new mixes to PFL mix
  useEffect(() => {
    const pflMix = savedMixes.find((mix) => mix.stripId === 1000);
    if (!pflMix) return;

    savedMixes.forEach((mix) => {
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
  }, [savedMixes, sendMessage]);
};
