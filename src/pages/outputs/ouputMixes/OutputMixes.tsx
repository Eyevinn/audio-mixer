import { MainVolume } from '../../../components/MainVolume';
import { useWebSocket } from '../../../components/WebSocketContext';

export const OutputMixesPage = () => {
  const { sendMessage } = useWebSocket();
  return (
    <div className="text-white text-2xl">
      Output Mixes {/* Main Volume */}
      <div className="flex space-x-2">
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
      </div>
    </div>
  );
};
