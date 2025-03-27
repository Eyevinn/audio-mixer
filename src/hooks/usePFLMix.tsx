import { useCallback, useEffect, useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { TMixStrip } from '../types/types';

export const usePFLMix = () => {
  const { mixes, setMixes } = useGlobalState();
  const [PFLMix, setPFLMix] = useState<TMixStrip | undefined>();
  useEffect(() => {
    setPFLMix(mixes?.find((m) => m.stripId === 1000));
  }, [mixes]);

  const setPFLStripMuted = useCallback(
    (type: 'strips' | 'mixes', id: number, isMuted: boolean) => {
      setMixes((prevState) =>
        prevState.map((mix) => {
          if (mix.stripId === 1000) {
            return {
              ...mix,
              inputs: {
                ...mix.inputs,
                [type]: {
                  ...mix.inputs[type],
                  [id]: {
                    ...mix.inputs[type][id],
                    muted: isMuted
                  }
                }
              }
            };
          } else {
            return mix;
          }
        })
      );
    },
    [setMixes]
  );

  return { PFLMix, setPFLStripMuted };
};
