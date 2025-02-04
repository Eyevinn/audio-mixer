import { useEffect, useState } from 'react';
import { AudioStrip } from '../../components/audioStrip/AudioStrip';
import { Strip } from '../../types/types';
import { addStrip, removeStrip } from '../../utils/utils';
import { useWebSocket } from '../../components/WebSocketContext';
import { EffectsPanel } from '../../components/EffectsPanel';

export const StripsPage = () => {
  const [localStrips, setLocalStrips] = useState<Strip[]>([]);
  const [selectedStrip, setSelectedStrip] = useState<number | null>(null);
  // const [removeMode, setRemoveMode] = useState(false);
  const { sendMessage, isConnected, connect, lastMessage } = useWebSocket();

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const data = JSON.parse(lastMessage);

      switch (data.type) {
        case 'response':
          if (data.resource === '/audio' && data.body?.strips) {
            setLocalStrips(data.body.strips);
          }
          break;

        case 'state-change':
          // ToDo: Implement state-change handling
          break;

        case 'sampling-update':
          // ToDo: Implement sampling-update handling
          break;
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [lastMessage, selectedStrip]);

  useEffect(() => {
    if (isConnected) {
      sendMessage({
        type: 'subscribe',
        resource: '/audio'
      });
    }
  }, [isConnected, sendMessage]);

  // Create a default strip object
  const createDefaultStrip = (id: number): Strip => ({
    id,
    label: `Strip ${id}`,
    volume: 0,
    panning: 0,
    muted: false,
    pfl: false,
    slot: localStrips.length,
    channel1: 0,
    channel2: 0,
    mode: 'mono',
    selected: false
  });

  const handleAddStrip = () => {
    const tempId = Date.now();
    const newStrip = createDefaultStrip(tempId);

    setLocalStrips((prev) => [...prev, newStrip]);

    addStrip(sendMessage);
  };

  const handleRemoveStrip = (stripId: number) => {
    removeStrip(stripId, sendMessage);
    setLocalStrips((prev) => prev.filter((strip) => strip.id !== stripId));
    if (selectedStrip === stripId) {
      setSelectedStrip(null);
    }
  };

  const handleStripChange = (
    stripId: number,
    property: string,
    value: number | boolean | string
  ) => {
    setLocalStrips((prevStrips) =>
      prevStrips.map((strip) =>
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

  return (
    <div className="text-white text-2xl">
      Audio Strips
      <button
        onClick={handleAddStrip}
        className="p-2 bg-green-600 rounded hover:bg-green-700"
      >
        Add Strip
      </button>
      {/* Audio Strips Container */}
      <div className="flex space-x-2">
        {localStrips.map((strip) => (
          <AudioStrip
            key={strip.id}
            {...strip}
            onLabelChange={(label) =>
              handleStripChange(strip.id, 'label', label)
            }
            onPanningChange={(panning) =>
              handleStripChange(strip.id, 'panning', panning)
            }
            onMuteChange={(muted) =>
              handleStripChange(strip.id, 'muted', muted)
            }
            onPflChange={(pfl) => handleStripChange(strip.id, 'pfl', pfl)}
            onVolumeChange={(volume) =>
              handleStripChange(strip.id, 'volume', volume)
            }
            onSelect={() => {
              handleStripChange(strip.id, 'selected', !strip.selected);
              setSelectedStrip(selectedStrip === null ? strip.id : null);
            }}
            onRemove={() => handleRemoveStrip(strip.id)}
          />
        ))}
      </div>
      {/* Effects Panel */}
      {selectedStrip !== null && (
        <EffectsPanel
          label={localStrips.find((s) => s.id === selectedStrip)?.label || ''}
          stripId={selectedStrip}
          onEffectChange={(filter, parameter, value) => {
            sendMessage({
              type: 'set',
              resource: `/audio/strips/${selectedStrip}/filters/${filter}/${parameter}`,
              body: { value }
            });
          }}
        />
      )}
    </div>
  );
};
