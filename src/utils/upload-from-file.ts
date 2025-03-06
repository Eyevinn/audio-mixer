import { ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import {
  currentAudioMixerName,
  currentAudioMixerVersion,
  SaveConfig
} from './save-to-file';
import { resetAudioRoot, subscribe, unsubscribeToAudio } from './wsCommands';

const uploadFromFile = (
  event: ChangeEvent<HTMLInputElement>,
  sendMessage: (
    message: Record<string, unknown> | Record<string, unknown>[]
  ) => void
) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) {
    toast.error('Could not find config file', {
      duration: 3000,
      position: 'bottom-right'
    });
    return;
  }
  const reader = new FileReader();
  reader.onloadend = function (event) {
    if (!event.target || typeof event.target.result !== 'string') return;
    const config: SaveConfig = JSON.parse(event.target.result);

    if (!config.sw || config.sw != currentAudioMixerName) {
      toast.error('Not a config file for this control panel', {
        duration: 3000,
        position: 'bottom-right'
      });
      return;
    }
    if (!config.version || config.version < currentAudioMixerVersion) {
      toast.error('Cannot read this config file, too old version', {
        duration: 3000,
        position: 'bottom-right'
      });
      return;
    }

    unsubscribeToAudio(sendMessage);
    resetAudioRoot(sendMessage);
    const requests = [];

    const audio = config.audio;
    for (const stripIndex in audio.body.strips) {
      const strip = audio.body.strips[stripIndex];
      requests.push({
        type: 'command',
        resource: '/audio/strips',
        body: {
          command: 'add_strip',
          parameters: {
            index: Number(stripIndex)
          }
        }
      });

      requests.push({
        type: 'set',
        resource: '/audio/strips/' + stripIndex,
        body: strip
      });

      const bands = strip.filters?.eq.bands;
      if (bands) {
        for (const bandIndex in bands) {
          requests.push({
            type: 'command',
            resource: '/audio/strips/' + stripIndex + '/filters/eq/bands',
            body: {
              command: 'add_band',
              parameters: {
                index: Number(bandIndex)
              }
            }
          });
          requests.push({
            type: 'set',
            resource:
              '/audio/strips/' + stripIndex + '/filters/eq/bands/' + bandIndex,
            body: {
              ...bands[bandIndex]
            }
          });
        }
      }
    }

    // Set all the strips config
    requests.push({
      type: 'set',
      resource: '/audio',
      body: {
        strips: audio.body.strips
      }
    });

    for (const mixIndex in audio.body.mixes) {
      const mix = audio.body.mixes[mixIndex];
      requests.push({
        type: 'command',
        resource: '/audio/mixes',
        body: {
          command: 'add_mix',
          parameters: {
            index: Number(mixIndex)
          }
        }
      });

      requests.push({
        type: 'set',
        resource: '/audio/mixes/' + mixIndex,
        body: mix
      });

      const subMixes = mix.inputs.mixes;
      for (const subMixId in subMixes) {
        requests.push({
          type: 'command',
          resource: '/audio/mixes/' + mixIndex + '/inputs/mixes',
          body: {
            command: 'add_mix',
            parameters: {
              index: Number(subMixId)
            }
          }
        });
      }

      const strips = mix.inputs.strips;
      for (const stripId in strips) {
        requests.push({
          type: 'command',
          resource: '/audio/mixes/' + mixIndex + '/inputs/strips',
          body: {
            command: 'add_strip',
            parameters: {
              index: Number(stripId)
            }
          }
        });
      }

      const bands = mix.filters?.eq.bands;
      if (bands) {
        for (const bandIndex in bands) {
          requests.push({
            type: 'command',
            resource: '/audio/mixes/' + mixIndex + '/filters/eq/bands',
            body: {
              command: 'add_band',
              parameters: {
                index: Number(bandIndex)
              }
            }
          });

          requests.push({
            type: 'set',
            resource:
              '/audio/mixes/' + mixIndex + '/filters/eq/bands/' + bandIndex,
            body: {
              ...bands[bandIndex]
            }
          });
        }
      }
    }

    // Set all the mixes config
    requests.push({
      type: 'set',
      resource: '/audio',
      body: {
        mixes: audio.body.mixes
      }
    });

    // Send each output in a separate request, since some outputs
    // may not exist any longer.
    for (const outputIndex in audio.body.outputs) {
      requests.push({
        type: 'set',
        resource: '/audio/outputs/' + outputIndex,
        body: audio.body.outputs[outputIndex]
      });
    }

    sendMessage(requests);
    subscribe(sendMessage);
  };
  reader.readAsText(file);
  event.target.value = '';
};

export default uploadFromFile;
