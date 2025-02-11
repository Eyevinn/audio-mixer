import React, { useRef, useState } from 'react';
import { AudioStrip } from '../strips/audioStrip/AudioStrip';
import { useGlobalState } from '../../context/GlobalStateContext';

interface ScrollableContainerProps {
  selectedStrip: number | null;
  setSelectedStrip: (value: React.SetStateAction<number | null>) => void;
  handleRemoveStrip: (stripId: number) => void;
}

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  selectedStrip,
  handleRemoveStrip,
  setSelectedStrip
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const { savedStrips } = useGlobalState();

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

  return (
    <div
      className="overflow-x-auto w-[97%] flex space-x-4 cursor-grab active:cursor-grabbing select-none"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {savedStrips.map((strip) => (
        <AudioStrip
          key={strip.id}
          {...strip}
          onSelect={() => {
            setSelectedStrip(selectedStrip !== strip.id ? strip.id : null);
          }}
          onRemove={() => handleRemoveStrip(strip.id)}
        />
      ))}
    </div>
  );
};
