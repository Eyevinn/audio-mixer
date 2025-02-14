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

// Other
export const resync = (
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'subscribe',
    resource: '/audio'
  });
};

export const subscribeToStrips = (
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'subscribe',
    resource: '/audio/strips'
  });
};

export const subscribeToMixes = (
  sendMessage: (message: Record<string, unknown>) => void
) => {
  sendMessage({
    type: 'subscribe',
    resource: '/audio/mixes'
  });
};

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
