import React, { useState, useEffect } from 'react';
import { ControlButtons } from './ControlButtons';
import { EffectsPanel } from '../strips/audioFilters/EffectsPanel';
import { MainVolume } from '../strips/mainVolume/MainVolume';
import { useWebSocket } from '../../context/WebSocketContext';
import { WebSocketDialog } from '../webSocket/WebSocketDialog';
import { Strip } from '../../types/types';
import {
  removeStrip,
  addStrip,
  resync,
  loadConfig,
  saveConfig
} from '../../utils/utils';

// TODO: Delete if not needed (currently not used)

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

  const handleResync = () => resync(sendMessage);
  const handleSaveConfig = () => saveConfig(sendMessage);
  const handleLoadConfig = (file: File) => loadConfig(file, sendMessage);

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
