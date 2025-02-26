import { AudioState } from './../types/types';

export interface SaveConfig {
  version: number;
  sw: string;
  audio: AudioState;
}

export const currentAudioMixerName = 'Ateliere Live Audio Mixer Config';
export const currentAudioMixerVersion = 1;

const saveToFile = (state: AudioState) => {
  const config: SaveConfig = {
    version: currentAudioMixerVersion,
    sw: currentAudioMixerName,
    audio: state
  };
  const link = document.createElement('a');
  const file = new Blob([JSON.stringify(config)], { type: 'text/plain' });
  link.href = URL.createObjectURL(file);
  const now = new Date();
  link.download =
    'Ateliere_Audio_Mixer_Config_' +
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    '_' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0') +
    '.config';
  link.click();
  URL.revokeObjectURL(link.href);
};

export default saveToFile;
