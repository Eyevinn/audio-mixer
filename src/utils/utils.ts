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
  sendMessage: (message: any) => void,
  index: number
) => {
  sendMessage({
    type: 'get',
    resource: `/audio/mixes/${index}`
  });
};

export const addStripToMix = (
  sendMessage: (message: any) => void,
  index: number,
  indexToAdd: number
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/mixes/${index}/inputs/strips`,
    body: { command: 'add_strip', parameters: { index: indexToAdd } }
  });
};

export const removeStripFromMix = (
  sendMessage: (message: any) => void,
  index: number,
  indexToRemove: number
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/mixes/${index}/inputs/strips`,
    body: { command: 'remove_strip', parameters: { index: indexToRemove } }
  });
};

export const addMixToMix = (
  sendMessage: (message: any) => void,
  index: number,
  indexToAdd: number
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/mixes/${index}/inputs/mixes`,
    body: { command: 'add_mix', parameters: { index: indexToAdd } }
  });
};

export const removeMixFromMix = (
  sendMessage: (message: any) => void,
  index: number,
  indexToRemove: number
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/mixes/${index}/inputs/mixes`,
    body: { command: 'remove_mix', parameters: { index: indexToRemove } }
  });
};

// Outputs
export const getAllOutputs = (sendMessage: (message: any) => void) => {
  sendMessage({
    type: 'get',
    resource: '/audio/outputs'
  });
};

export const setOutputLabel = (
  sendMessage: (message: any) => void,
  outputName: string,
  label: string
) => {
  sendMessage({
    type: 'set',
    resource: `/audio/outputs/${outputName}`,
    body: {
      parameters: {
        label: label
      }
    }
  });
};

export const addInputToOutput = (
  sendMessage: (message: any) => void,
  outputName: string,
  inputIndex: number,
  origin: 'pre_fader' | 'post_fader',
  source: 'strip' | 'mix'
) => {
  console.log('URL: ', `/audio/outputs/${outputName}/input`);
  console.log('inputIndex: ', inputIndex);
  console.log('origin: ', origin);
  console.log('source: ', source);
  sendMessage({
    type: 'set',
    resource: `/audio/outputs/${outputName}/input`,
    body: {
      parameters: {
        index: inputIndex,
        origin: origin,
        source: source
      }
    }
  });
};

// Subscriptions
export const resync = (
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'subscribe',
    resource: '/audio'
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
  stripId: number,
  index: number
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/strips/${stripId}/filters/eq`,
    body: { command: 'add_band', parameters: { index: index } }
  });
};

export const removeEQBand = (
  sendMessage: (message: Record<string, unknown>) => void,
  stripId: number,
  index: number
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/strips/${stripId}/filters/eq`,
    body: { command: 'remove_band', parameters: { index: index } }
  });
};
