import React, { useMemo, useRef, useState } from 'react';
import { OutputScrollItem } from '../../pages/outputs/OutputScrollItem';
import { TAudioStrip, TMixStrip, TOutput } from '../../types/types';
import { AudioStrip } from '../strips/audioStrip/AudioStrip';
import { MixStrip } from '../strips/mixStrip/MixStrip';
import { ConfigureMixStrip } from '../strips/stripComponents/configure/ConfigureMixStrip';
import { useScrollIntoView } from '../../hooks/useScrollIntoView';

interface ScrollableContainerProps {
  audioStrips?: TAudioStrip[];
  mixStrips?: TMixStrip[];
  configurableMixStrips?: TMixStrip;
  outputStrips?: { [key: string]: TOutput };
  isOutputPage?: boolean;
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

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  audioStrips,
  mixStrips,
  configurableMixStrips,
  outputStrips,
  isOutputPage,
  isPFL,
  handleRemoveStrip,
  handleRemoveStripFromMix,
  onStripSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mixRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const stripRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [stopScrollIntoView, setStopScrollIntoView] = useState<boolean>(true);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [highlightedMixId, setHighlightedMixId] = useState<number | null>(null);

  useScrollIntoView({
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
  });
  const sortedOutputs = useMemo(() => {
    if (!outputStrips) return [];

    const programRegex = /program/i;

    return Object.entries(outputStrips).sort(
      ([keyA, outputA], [keyB, outputB]) => {
        const isProgramA = programRegex.test(keyA);
        const isProgramB = programRegex.test(keyB);

        if (isProgramA && !isProgramB) return -1;
        if (!isProgramA && isProgramB) return 1;

        if (outputA.input.index !== 0 && outputB.input.index === 0) return -1;
        if (outputA.input.index === 0 && outputB.input.index !== 0) return 1;

        return 0;
      }
    );
  }, [outputStrips]);

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
    setStopScrollIntoView(true);
    if (containerRef.current) {
      const target = e.target as HTMLElement;
      if (target.closest('.select-dropdown')) {
        e.stopPropagation();
        return;
      }
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div
      className={`h-full overflow-x-auto w-full flex cursor-grab active:cursor-grabbing select-none scrollbar-thumb-border-bg scrollbar-track-transparent scrollbar-thin
        ${isOutputPage ? 'space-x-8' : 'space-x-4'}
      `}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {audioStrips?.map((strip) => {
        return (
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
                isPFL?.inputs?.strips?.[strip.stripId]?.muted ?? undefined
              }
              onStripSelect={onStripSelect}
              onRemove={() =>
                handleRemoveStrip
                  ? handleRemoveStrip(strip.stripId)
                  : () => console.warn('No remove function provided')
              }
            />
          </div>
        );
      })}
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
                isPFL?.inputs?.mixes?.[mix.stripId]?.muted ?? undefined
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
                    isPFL?.inputs?.strips?.[parseInt(key, 10)]?.muted ??
                    undefined
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
                    isPFL?.inputs?.mixes?.[parseInt(key, 10)]?.muted ??
                    undefined
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
      {sortedOutputs.map(([key, output]) => {
        return (
          <OutputScrollItem
            ref={(el) => {
              output.input.source === 'mix'
                ? (mixRefs.current[output.input.index] = el)
                : (stripRefs.current[output.input.index] = el);
            }}
            key={key}
            output={output}
            outputName={key}
            isPFLInactive={
              output.input.source === 'mix'
                ? isPFL?.inputs?.mixes[output.input.index]?.muted
                : isPFL?.inputs?.strips[output.input.index]?.muted
            }
            onSelect={onStripSelect}
          />
        );
      })}
    </div>
  );
};
