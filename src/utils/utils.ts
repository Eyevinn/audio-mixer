/* eslint-disable @typescript-eslint/no-explicit-any */
export const addStrip = (sendMessage: (message: any) => void) => {
  sendMessage({
    type: 'command',
    resource: '/audio/strips',
    body: { command: 'add', parameters: {} }
  });
};

export const removeStrip = (
  stripId: number,
  sendMessage: (message: any) => void
) => {
  sendMessage({
    type: 'command',
    resource: `/audio/strips/${stripId}`,
    body: { command: 'remove', parameters: {} }
  });
};

export const removeAllStrips = (sendMessage: (message: any) => void) => {
  sendMessage({
    type: 'command',
    resource: '/audio/strips',
    body: { command: 'remove_all', parameters: {} }
  });
};

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
