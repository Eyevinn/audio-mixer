/* eslint-disable @typescript-eslint/no-explicit-any */

// Strips
export const addStrip = (
  sendMessage: (message: any) => void,
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
  sendMessage: (message: any) => void
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/strips`,
    body: { command: 'remove_strip', parameters: { index: index } }
  });
};

export const getAllStrips = (sendMessage: (message: any) => void) => {
  sendMessage({
    type: 'get',
    resource: '/audio/strips'
  });
};

// Other
export const resync = (sendMessage: (message: any) => void) => {
  sendMessage({
    type: 'subscribe',
    resource: '/audio'
  });
};

export const saveConfig = (sendMessage: (message: any) => void) => {
  sendMessage({
    type: 'command',
    resource: '/audio',
    body: { command: 'save', parameters: {} }
  });
};

export const loadConfig = (file: File, sendMessage: (message: any) => void) => {
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
