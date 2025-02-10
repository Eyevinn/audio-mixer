import React, { useState, useEffect } from 'react';
import { AudioStrip } from '../strips/audioStrip/AudioStrip';
import { ControlButtons } from './ControlButtons';
import { EffectsPanel } from '../strips/audioFilters/EffectsPanel';
import { MainVolume } from '../strips/mainVolume/MainVolume';
import { useWebSocket } from '../../context/WebSocketContext';
import { WebSocketDialog } from '../webSocket/WebSocketDialog';
import { Strip } from '../../types/types';
import {
  removeStrip,
  addStrip,
  removeAllStrips,
  resync,
  loadConfig,
  saveConfig
} from '../../utils/utils';

export const AudioControlPanel: React.FC = () => {
  const [localStrips, setLocalStrips] = useState<Strip[]>([]);
  const [selectedStrip, setSelectedStrip] = useState<number | null>(null);
  const [removeMode, setRemoveMode] = useState(false);
  const { sendMessage, isConnected, lastMessage } = useWebSocket();

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

  const handleRemoveAllStrips = () => {
    removeAllStrips(sendMessage);
    setLocalStrips([]);
    setSelectedStrip(null);
  };

  const handleResync = () => resync(sendMessage);
  const handleSaveConfig = () => saveConfig(sendMessage);
  const handleLoadConfig = (file: File) => loadConfig(file, sendMessage);

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

  return (
    <div className="min-h-screen bg-strip-bg text-white">
      {!isConnected && <WebSocketDialog />}

      <div className="container mx-auto p-4">
        <div className="flex">
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
                onRemove={() => removeMode && handleRemoveStrip(strip.id)}
              />
            ))}
          </div>

          {/* Main Volume */}
          <MainVolume
            onVolumeChange={(volume) =>
              sendMessage({
                type: 'set',
                resource: '/audio/outputs/0/main_fader/volume',
                body: { value: volume }
              })
            }
            onMuteChange={(muted) =>
              sendMessage({
                type: 'set',
                resource: '/audio/outputs/0/main_fader/muted',
                body: { value: muted }
              })
            }
            onResetLUFS={() =>
              sendMessage({
                type: 'command',
                resource: '/audio/outputs/0/meters',
                body: { command: 'reset', parameters: {} }
              })
            }
          />

          {/* Control Buttons */}
          <ControlButtons
            removeMode={removeMode}
            onAddStrip={handleAddStrip}
            onToggleRemoveMode={() => setRemoveMode(!removeMode)}
            onRemoveAllStrips={handleRemoveAllStrips}
            onResync={handleResync}
            onLoadConfig={handleLoadConfig}
            onSaveConfig={handleSaveConfig}
          />
        </div>

        {/* Effects Panel */}
        {selectedStrip !== null && (
          <EffectsPanel
            label={localStrips.find((s) => s.id === selectedStrip)?.label || ''}
            stripId={selectedStrip}
          />
        )}
      </div>

      {/* Error Messages */}
      <div
        id="error_message_list"
        className="fixed bottom-4 right-4 space-y-2"
      />
    </div>
  );
};
