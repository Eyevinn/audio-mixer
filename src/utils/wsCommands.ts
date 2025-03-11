// Strips
export const addStrip = (
  sendMessage: (message: Record<string, unknown>) => void,
  index: number
) => {
  sendMessage({
    type: 'command',
    resource: '/audio/strips',
    body: { command: 'add_strip', parameters: { index: index } }
  });
};

export const removeStrip = (
  index: number,
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/strips`,
    body: { command: 'remove_strip', parameters: { index: index } }
  });
};

export const getStripByIndex = (
  sendMessage: (message: Record<string, unknown>) => void,
  index: number
) => {
  sendMessage({
    type: 'get',
    resource: `/audio/strips/${index}`
  });
};

export const getAllStrips = (
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'get',
    resource: '/audio/strips'
  });
};

// Mixes
export const addMix = (
  sendMessage: (message: Record<string, unknown>) => void,
  index: number
) => {
  sendMessage({
    type: 'command',
    resource: '/audio/mixes',
    body: { command: 'add_mix', parameters: { index: index } }
  });
};

export const removeMix = (
  index: number,
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'command',
    resource: '/audio/mixes',
    body: { command: 'remove_mix', parameters: { index: index } }
  });
};

export const getAllMixes = (
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'get',
    resource: '/audio/mixes'
  });
};

export const getMixByIndex = (
  sendMessage: (message: Record<string, unknown>) => void,
  index: number
) => {
  sendMessage({
    type: 'get',
    resource: `/audio/mixes/${index}`
  });
};

export const addStripToMix = (
  sendMessage: (message: Record<string, unknown>) => void,
  index: number,
  indexToAdd: number
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/mixes/${index}/inputs/strips`,
    body: { command: 'add_strip', parameters: { index: indexToAdd } }
  });
};

export const addMixToMix = (
  sendMessage: (message: Record<string, unknown>) => void,
  index: number,
  indexToAdd: number
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/mixes/${index}/inputs/mixes`,
    body: { command: 'add_mix', parameters: { index: indexToAdd } }
  });
};

export const removeInputFromMix = (
  sendMessage: (message: Record<string, unknown>) => void,
  index: number,
  indexToRemove: number,
  type: 'mixes' | 'strips'
) => {
  const command = type === 'mixes' ? 'remove_mix' : 'remove_strip';
  sendMessage({
    type: 'command',
    resource: `/audio/mixes/${index}/inputs/${type}`,
    body: { command: command, parameters: { index: indexToRemove } }
  });
};

// Outputs
export const getAllOutputs = (
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'get',
    resource: '/audio/outputs'
  });
};

export const getOutputInput = (
  sendMessage: (message: Record<string, unknown>) => void,
  outputName: string
) => {
  sendMessage({
    type: 'get',
    resource: `/audio/outputs/${outputName}/input`
  });
};

export const addInputToOutput = (
  sendMessage: (message: Record<string, unknown>) => void,
  outputName: string,
  inputIndex: number,
  origin: 'pre_fader' | 'post_fader',
  source: 'strip' | 'mix'
) => {
  sendMessage({
    type: 'set',
    resource: `/audio/outputs/${outputName}/input`,
    body: {
      index: inputIndex,
      origin: origin,
      source: source
    }
  });
};

export const removeInputFromOutput = (
  sendMessage: (message: Record<string, unknown>) => void,
  outputName: string
) => {
  sendMessage({
    type: 'set',
    resource: `/audio/outputs/${outputName}/input`,
    body: {
      index: 0,
      origin: 'post_fader',
      source: 'mix'
    }
  });
};

export const resetOutputMeters = (
  sendMessage: (message: Record<string, unknown>) => void,
  outputName: string
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/outputs/${outputName}/meters`,
    body: { command: 'reset' }
  });
};

export const enableEbuMeters = (
  sendMessage: (message: Record<string, unknown>) => void,
  outputName: string,
  enableEbuMeters: boolean
) => {
  console.log('enableEbuMeters', enableEbuMeters);
  sendMessage({
    type: 'set',
    resource: `/audio/outputs/${outputName}/meters`,
    body: { enable_ebu_meters: enableEbuMeters }
  });
};

// Subscriptions
export const subscribe = (
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'subscribe',
    resource: '/audio'
  });

  const samplingRate = 100;

  // Start sampling
  sendMessage({
    type: 'sampling-start',
    resource: '/audio/strips/*/pre_fader_meter/*',
    body: { interval_ms: samplingRate }
  });

  sendMessage({
    type: 'sampling-start',
    resource: '/audio/mixes/*/pre_fader_meter/*',
    body: { interval_ms: samplingRate }
  });

  sendMessage({
    type: 'sampling-start',
    resource: '/audio/outputs/*/meters/*',
    body: {
      interval_ms: samplingRate
    }
  });
};

// Other
export const loadConfig = (
  file: File,
  sendMessage: (message: Record<string, unknown>) => void
) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result;
    if (typeof content === 'string') {
      sendMessage({
        type: 'command',
        resource: '/audio',
        body: { command: 'load', parameters: { content } }
      });
    }
  };
  reader.readAsText(file);
};

export const addEQBand = (
  sendMessage: (message: Record<string, unknown>) => void,
  type: 'strips' | 'mixes',
  stripId: number,
  index: number
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/${type}/${stripId}/filters/eq/bands`,
    body: { command: 'add_band', parameters: { index: index } }
  });
};

export const removeEQBand = (
  sendMessage: (message: Record<string, unknown>) => void,
  type: 'strips' | 'mixes',
  stripId: number,
  index: number
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/${type}/${stripId}/filters/eq/bands`,
    body: { command: 'remove_band', parameters: { index: index } }
  });
};

// Saving and exporting audio state
export const getAudioRoot = (
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'get',
    resource: '/audio'
  });
};

export const resetAudioRoot = (
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'command',
    resource: `/audio`,
    body: { command: 'reset', parameters: {} }
  });
};

export const unsubscribeToAudio = (
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'unsubscribe',
    resource: '/audio'
  });
};
