import React, { useEffect, useRef, useState } from 'react';
import { TAudioStrip, TMixStrip } from '../../types/types';
import { AudioStrip } from '../strips/audioStrip/AudioStrip';
import { MixStrip } from '../strips/mixStrip/MixStrip';

interface ScrollableContainerProps {
  audioStrips?: TAudioStrip[];
  mixStrips?: TMixStrip[];
  isRemovingFromMix?: boolean;
  handleRemoveStrip?: (stripId: number) => void;
  handleRemoveStripFromMix?: (input: TAudioStrip | TMixStrip) => void;
  onStripSelect: (stripId: number | null) => void;
}

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  audioStrips,
  mixStrips,
  isRemovingFromMix,
  handleRemoveStrip,
  handleRemoveStripFromMix,
  onStripSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mixRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [highlightedMixId, setHighlightedMixId] = useState<number | null>(null);

  useEffect(() => {
    if (
      highlightedMixId !== null &&
      mixRefs.current[highlightedMixId] &&
      containerRef.current
    ) {
      mixRefs.current[highlightedMixId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [highlightedMixId, mixStrips]);

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
      className="overflow-x-auto w-[97%] flex space-x-4 cursor-grab active:cursor-grabbing select-none scrollbar-thumb-border-bg scrollbar-track-transparent scrollbar-thin"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {audioStrips?.map((strip) => (
        <AudioStrip
          isRemovingFromMix={isRemovingFromMix}
          key={`${strip.stripId}-strip`}
          {...strip}
          onStripSelect={onStripSelect}
          onRemove={
            isRemovingFromMix && handleRemoveStripFromMix
              ? () => handleRemoveStripFromMix(strip)
              : handleRemoveStrip
                ? () => handleRemoveStrip(strip.stripId)
                : () => console.warn('No remove function provided')
          }
        />
      ))}
      {mixStrips?.map((mix) => (
        <div
          key={`${mix.stripId}-mix`}
          ref={(el) => {
            mixRefs.current[mix.stripId] = el;
          }}
        >
          <MixStrip
            highlightedMixId={highlightedMixId}
            setHighlightedMixId={setHighlightedMixId}
            isRemovingFromMix={isRemovingFromMix}
            {...mix}
            onStripSelect={onStripSelect}
            onRemove={
              isRemovingFromMix && handleRemoveStripFromMix
                ? () => handleRemoveStripFromMix(mix)
                : handleRemoveStrip
                  ? () => handleRemoveStrip(mix.stripId)
                  : () => console.warn('No remove function provided')
            }
          />
        </div>
      ))}
    </div>
  );
};
