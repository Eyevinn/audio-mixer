import { useEffect, useState } from 'react';
import { TAudioStrip, TMixStrip, TOutput } from '../types/types';
import { useGlobalState } from '../context/GlobalStateContext';

type TScrollIntoViewProps = {
  audioStrips?: TAudioStrip[];
  mixStrips?: TMixStrip[];
  configurableMixStrips?: TMixStrip;
  outputStrips?: { [key: string]: TOutput };
  highlightedMixId: number | null;
  stopScrollIntoView: boolean;
  stripRefs: React.RefObject<{ [key: number]: HTMLDivElement | null }>;
  mixRefs: React.RefObject<{ [key: number]: HTMLDivElement | null }>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setStopScrollIntoView: (stopScrollIntoView: boolean) => void;
};

const scrollBehavior: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
};

export const useScrollIntoView = ({
  audioStrips,
  mixStrips,
  configurableMixStrips,
  outputStrips,
  highlightedMixId,
  stopScrollIntoView,
  stripRefs,
  mixRefs,
  containerRef,
  setStopScrollIntoView
}: TScrollIntoViewProps) => {
  const [selectedMix, setSelectedMix] = useState<TMixStrip | null>(null);
  const [selectedStrip, setSelectedStrip] = useState<TAudioStrip | null>(null);
  const { mixes, strips } = useGlobalState();

  useEffect(() => {
    const findSelectedMix = mixes?.find((mix) => mix.selected);
    const findSelectedStrip = strips?.find((strip) => strip.selected);
    if (
      findSelectedMix?.stripId &&
      selectedMix?.stripId !== findSelectedMix.stripId
    ) {
      setSelectedMix(findSelectedMix);
    } else if (
      findSelectedStrip?.stripId &&
      selectedStrip?.stripId !== findSelectedStrip.stripId
    ) {
      setSelectedStrip(findSelectedStrip);
    }
  }, [mixes, selectedMix, selectedStrip, strips]);

  useEffect(() => {
    if (selectedStrip || selectedMix) {
      setStopScrollIntoView(false);
    }
  }, [selectedStrip, selectedMix, setStopScrollIntoView]);

  useEffect(() => {
    if (
      highlightedMixId !== null &&
      mixRefs.current[highlightedMixId] &&
      containerRef.current
    ) {
      mixRefs.current[highlightedMixId]?.scrollIntoView(scrollBehavior);
    }
  }, [containerRef, highlightedMixId, mixRefs, mixStrips]);

  useEffect(() => {
    if (stopScrollIntoView) return;

    audioStrips?.forEach((strip) => {
      if (strip.selected && stripRefs.current[strip.stripId]) {
        stripRefs.current[strip.stripId]?.scrollIntoView(scrollBehavior);
      }
    });

    mixStrips?.forEach((mix) => {
      if (mix.selected && mixRefs.current[mix.stripId]) {
        mixRefs.current[mix.stripId]?.scrollIntoView(scrollBehavior);
      }
    });

    if (configurableMixStrips?.inputs.strips) {
      Object.entries(configurableMixStrips.inputs.strips).forEach(([key]) => {
        const strip = strips?.find(
          (strip) => strip.stripId === parseInt(key, 10)
        );
        if (strip?.selected && stripRefs.current[parseInt(key, 10)]) {
          stripRefs.current[parseInt(key, 10)]?.scrollIntoView(scrollBehavior);
        }
      });
    }

    if (configurableMixStrips?.inputs.mixes) {
      Object.entries(configurableMixStrips.inputs.mixes).forEach(([key]) => {
        const mix = mixes?.find((mix) => mix.stripId === parseInt(key, 10));
        if (mix?.selected && mixRefs.current[parseInt(key, 10)]) {
          mixRefs.current[parseInt(key, 10)]?.scrollIntoView(scrollBehavior);
        }
      });
    }

    if (outputStrips) {
      Object.values(outputStrips).forEach((output) => {
        if (output.input.source === 'mix') {
          const mix = mixes?.find((mix) => mix.stripId === output.input.index);
          if (mix?.selected && mixRefs.current[mix.stripId]) {
            mixRefs.current[mix.stripId]?.scrollIntoView(scrollBehavior);
          }
        } else if (output.input.source === 'strip') {
          const strip = strips?.find(
            (strip) => strip.stripId === output.input.index
          );
          if (strip?.selected && stripRefs.current[strip.stripId]) {
            stripRefs.current[strip.stripId]?.scrollIntoView(scrollBehavior);
          }
        }
      });
    }
  }, [
    audioStrips,
    configurableMixStrips?.inputs.mixes,
    configurableMixStrips?.inputs.strips,
    mixRefs,
    mixStrips,
    mixes,
    outputStrips,
    stopScrollIntoView,
    stripRefs,
    strips
  ]);

  return;
};
