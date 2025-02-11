import React, { useRef, useState } from 'react';
import { Strip } from '../../types/types';
import { AudioStrip } from '../strips/audioStrip/AudioStrip';
import { useWebSocket } from '../../context/WebSocketContext';

interface ScrollableContainerProps {
  strips: Strip[];
  selectedStrip: number | null;
  setLocalStrips: (value: React.SetStateAction<Strip[]>) => void;
  setSelectedStrip: (value: React.SetStateAction<number | null>) => void;
  handleRemoveStrip: (stripId: number) => void;
}

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  strips,
  selectedStrip,
  setLocalStrips,
  handleRemoveStrip,
  setSelectedStrip
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const { sendMessage } = useWebSocket();

  const handleStripChange = (
    stripId: number,
    property: string,
    value: number | boolean | string
  ) => {
    setLocalStrips((prevStrips) =>
      prevStrips.map((strip: Strip) =>
        strip.id === stripId ? { ...strip, [property]: value } : strip
      )
    );

    if (property === 'selected') return;

    // ToDo: Implement real endpoints and body
    sendMessage({
      type: 'set',
      resource: `/audio/strips/${stripId}/${property}`,
      body: { value }
    });
  };

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
      {strips.map((strip) => (
        <AudioStrip
          key={strip.id}
          {...strip}
          onLabelChange={(label) => handleStripChange(strip.id, 'label', label)}
          onPanningChange={(panning) =>
            handleStripChange(strip.id, 'panning', panning)
          }
          onMuteChange={(muted) => handleStripChange(strip.id, 'muted', muted)}
          onPflChange={(pfl) => handleStripChange(strip.id, 'pfl', pfl)}
          onVolumeChange={(volume) =>
            handleStripChange(strip.id, 'volume', volume)
          }
          onSelect={() => {
            setLocalStrips((prevStrips) =>
              prevStrips.map((s) => ({
                ...s,
                selected: s.id === strip.id ? !s.selected : false
              }))
            );

            setSelectedStrip(selectedStrip === strip.id ? null : strip.id);
          }}
          onRemove={() => handleRemoveStrip(strip.id)}
        />
      ))}
    </div>
  );
};
