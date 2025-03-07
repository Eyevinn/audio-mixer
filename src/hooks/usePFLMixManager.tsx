import { useCallback, useEffect, useRef, useState } from 'react';
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
  const noStrips = strips.length === 0;
  const [stripsLength, setStripsLength] = useState<number | null>(null);
  const [mixesLength, setMixesLength] = useState<number | null>(null);

  const resetProcessedSets = useCallback(() => {
    processedStrips.current.clear();
    processedMixes.current.clear();
    setStripsLength(null);
    setMixesLength(null);
  }, []);

  const createPFLMix = useCallback(() => {
    resetProcessedSets();
    addMix(sendMessage, 1000);
    addInputToOutput(sendMessage, 'pfl', 1000, 'pre_fader', 'mix');
  }, [sendMessage, resetProcessedSets]);

  useEffect(() => {
    if (stripsLength !== processedStrips.current.size) {
      processedStrips.current.clear();
    }
  }, [stripsLength]);

  useEffect(() => {
    if (mixesLength !== processedMixes.current.size) {
      processedMixes.current.clear();
    }
  }, [mixesLength]);

  // Ensure PFL mix exists
  useEffect(() => {
    if (!pflMix && !noStrips) {
      createPFLMix();
    }
  }, [pflMix, noStrips, createPFLMix]);

  const addStripToPFLMix = useCallback(
    (isAlreadyInPFL: boolean, id: number) => {
      if (!isAlreadyInPFL) {
        addStripToMix(sendMessage, 1000, id);
      }
    },
    [sendMessage]
  );

  // Add new strips to PFL mix
  useEffect(() => {
    if (!pflMix || stripsLength === strips.length) return;

    strips.forEach((strip) => {
      setStripsLength(strips.length);
      if (processedStrips.current.has(strip.stripId)) return;

      const isAlreadyInPFL =
        pflMix.inputs?.strips &&
        Object.keys(pflMix.inputs.strips).map(Number).includes(strip.stripId);

      addStripToPFLMix(isAlreadyInPFL, strip.stripId);

      processedStrips.current.add(strip.stripId);
    });
  }, [stripsLength, strips, pflMix, addStripToPFLMix]);

  const addMixToPFLMix = useCallback(
    (isAlreadyInPFL: boolean, id: number) => {
      if (!isAlreadyInPFL) {
        addMixToMix(sendMessage, 1000, id);
      }
    },
    [sendMessage]
  );

  // Add new mixes to PFL mix
  useEffect(() => {
    if (!pflMix || mixesLength === mixes.length) return;

    mixes.forEach((mix) => {
      setMixesLength(mixes.length);
      if (mix.stripId === 1000 || processedMixes.current.has(mix.stripId))
        return;

      const isAlreadyInPFL =
        pflMix.inputs?.mixes &&
        Object.keys(pflMix.inputs.mixes).map(Number).includes(mix.stripId);

      addMixToPFLMix(isAlreadyInPFL, mix.stripId);

      processedMixes.current.add(mix.stripId);
    });
  }, [mixesLength, mixes, pflMix, addMixToPFLMix]);
};
