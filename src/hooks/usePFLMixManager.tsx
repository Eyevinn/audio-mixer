import { useCallback, useEffect, useRef } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
  addInputToOutput,
  addMix,
  addMixToMix,
  addStripToMix
} from '../utils/wsCommands';

export const usePFLMixManager = () => {
  const { mixes, strips } = useGlobalState();
  const { sendMessage } = useWebSocket();

  const processedStrips = useRef<Set<number>>(new Set());
  const processedMixes = useRef<Set<number>>(new Set());
  const pflMix = mixes.find((mix) => mix.stripId === 1000);

  const resetProcessedSets = useCallback(() => {
    processedStrips.current.clear();
    processedMixes.current.clear();
  }, []);

  const setPFLMix = useCallback(() => {
    resetProcessedSets();
    addMix(sendMessage, 1000);
  }, [sendMessage, resetProcessedSets]);

  // Ensure PFL mix exists
  useEffect(() => {
    if (!pflMix) {
      setPFLMix();
      addInputToOutput(sendMessage, 'pfl', 1000, 'pre_fader', 'mix');
    }
  }, [pflMix, setPFLMix]);

  // Add new strips to PFL mix
  useEffect(() => {
    if (!pflMix) return;

    strips.forEach((strip) => {
      if (processedStrips.current.has(strip.stripId)) return;

      const isAlreadyInPFL =
        pflMix.inputs?.strips &&
        Object.keys(pflMix.inputs.strips).map(Number).includes(strip.stripId);

      if (!isAlreadyInPFL) {
        addStripToMix(sendMessage, 1000, strip.stripId);
      }

      processedStrips.current.add(strip.stripId);
    });
  }, [strips, pflMix, sendMessage]);

  // Add new mixes to PFL mix
  useEffect(() => {
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
  }, [mixes, pflMix, sendMessage]);
};
