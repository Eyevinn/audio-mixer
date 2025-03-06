import React, { useEffect, useRef, useState } from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { TAudioStrip, TMixStrip } from '../../types/types';
import { AudioStrip } from '../strips/audioStrip/AudioStrip';
import { MixStrip } from '../strips/mixStrip/MixStrip';
import { ConfigureMixStrip } from '../strips/stripComponents/configure/ConfigureMixStrip';

interface ScrollableContainerProps {
  audioStrips?: TAudioStrip[];
  mixStrips?: TMixStrip[];
  configurableMixStrips?: TMixStrip;
  isPFL?: TMixStrip;
  handleRemoveStrip?: (stripId: number) => void;
  handleRemoveStripFromMix?: ({
    stripId,
    type
  }: {
    stripId: number;
    type: 'mixes' | 'strips';
  }) => void;
  onStripSelect: (stripId: number | null, type: 'mixes' | 'strips') => void;
}

const scrollBehavior: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
};

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  audioStrips,
  mixStrips,
  configurableMixStrips,
  isPFL,
  handleRemoveStrip,
  handleRemoveStripFromMix,
  onStripSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mixRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const stripRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [highlightedMixId, setHighlightedMixId] = useState<number | null>(null);
  const { mixes, strips } = useGlobalState();

  useEffect(() => {
    if (
      highlightedMixId !== null &&
      mixRefs.current[highlightedMixId] &&
      containerRef.current
    ) {
      mixRefs.current[highlightedMixId]?.scrollIntoView(scrollBehavior);
    }
  }, [highlightedMixId, mixStrips]);

  useEffect(() => {
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
        const strip = strips.find(
          (strip) => strip.stripId === parseInt(key, 10)
        );
        if (strip?.selected && stripRefs.current[parseInt(key, 10)]) {
          stripRefs.current[parseInt(key, 10)]?.scrollIntoView(scrollBehavior);
        }
      });
    }

    if (configurableMixStrips?.inputs.mixes) {
      Object.entries(configurableMixStrips.inputs.mixes).forEach(([key]) => {
        const mix = mixes.find((mix) => mix.stripId === parseInt(key, 10));
        if (mix?.selected && mixRefs.current[parseInt(key, 10)]) {
          mixRefs.current[parseInt(key, 10)]?.scrollIntoView(scrollBehavior);
        }
      });
    }
  }, [audioStrips, mixStrips, configurableMixStrips, mixes, strips]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div
      className="overflow-x-auto w-full h-full flex space-x-4 cursor-grab active:cursor-grabbing select-none scrollbar-thumb-border-bg scrollbar-track-transparent scrollbar-thin"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {audioStrips?.map((strip) => (
        <div
          key={`${strip.stripId}-strip`}
          ref={(el) => {
            stripRefs.current[strip.stripId] = el;
          }}
        >
          <AudioStrip
            key={`${strip.stripId}-strip`}
            {...strip}
            isPFLInactive={
              isPFL?.inputs?.strips[strip.stripId]?.muted ?? undefined
            }
            onStripSelect={onStripSelect}
            onRemove={() =>
              handleRemoveStrip
                ? handleRemoveStrip(strip.stripId)
                : () => console.warn('No remove function provided')
            }
          />
        </div>
      ))}
      {mixStrips?.map((mix) => {
        if (mix.stripId === 1000) return null;
        return (
          <div
            key={`${mix.stripId}-mix`}
            ref={(el) => {
              mixRefs.current[mix.stripId] = el;
            }}
          >
            <MixStrip
              highlightedMixId={highlightedMixId}
              setHighlightedMixId={setHighlightedMixId}
              {...mix}
              isPFLInactive={
                isPFL?.inputs?.mixes[mix.stripId]?.muted ?? undefined
              }
              onStripSelect={onStripSelect}
              onRemove={() =>
                handleRemoveStrip
                  ? handleRemoveStrip(mix.stripId)
                  : () => console.warn('No remove function provided')
              }
            />
          </div>
        );
      })}
      {configurableMixStrips?.inputs?.strips && (
        <>
          {Object.entries(configurableMixStrips.inputs.strips).map(
            ([key, strip]) => (
              <div
                key={parseInt(key, 10)}
                ref={(el) => {
                  stripRefs.current[parseInt(key, 10)] = el;
                }}
              >
                <ConfigureMixStrip
                  key={key}
                  stripId={configurableMixStrips.stripId}
                  configId={parseInt(key, 10)}
                  sendLevels={strip}
                  type="strips"
                  isPFLInactive={
                    isPFL?.inputs?.strips[parseInt(key, 10)]?.muted ?? undefined
                  }
                  onStripSelect={onStripSelect}
                  onRemove={() =>
                    handleRemoveStripFromMix
                      ? handleRemoveStripFromMix({
                          stripId: parseInt(key, 10),
                          type: 'strips'
                        })
                      : () => console.warn('No remove function provided')
                  }
                />
              </div>
            )
          )}
        </>
      )}
      {configurableMixStrips && (
        <>
          {Object.entries(configurableMixStrips.inputs.mixes).map(
            ([key, mix]) => (
              <div
                key={parseInt(key, 10)}
                ref={(el) => {
                  mixRefs.current[parseInt(key, 10)] = el;
                }}
              >
                <ConfigureMixStrip
                  key={key}
                  stripId={configurableMixStrips.stripId}
                  configId={parseInt(key, 10)}
                  sendLevels={mix}
                  type="mixes"
                  isPFLInactive={
                    isPFL?.inputs?.mixes[parseInt(key, 10)]?.muted ?? undefined
                  }
                  onStripSelect={onStripSelect}
                  onRemove={() =>
                    handleRemoveStripFromMix
                      ? handleRemoveStripFromMix({
                          stripId: parseInt(key, 10),
                          type: 'mixes'
                        })
                      : () => console.warn('No remove function provided')
                  }
                />
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};
