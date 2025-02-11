// TODO: Make sure the message type is correct
interface Message {
  type: string;
  resource: string;
  body?: {
    command: string;
    parameters: {
      index?: number;
      content?: string;
    };
  };
}

export const addStrip = (
  sendMessage: (message: Message) => void,
  index: number
) => {
  console.log('should add strip');
  sendMessage({
    type: 'command',
    resource: '/audio/strips',
    body: { command: 'add_strip', parameters: { index: index } }
    body: { command: 'add_strip', parameters: { index: index } }
  });
};

export const removeStrip = (
  index: number,
  sendMessage: (message: Message) => void
) => {
  console.log('should  remove strip');
  sendMessage({
    type: 'command',
    resource: `/audio/strips`,
    body: { command: 'remove_strip', parameters: { index: index } }
    resource: `/audio/strips`,
    body: { command: 'remove_strip', parameters: { index: index } }
  });
};

export const getAllStrips = (sendMessage: (message: Message) => void) => {
  sendMessage({
    type: 'get',
    resource: '/audio/strips'
    type: 'get',
    resource: '/audio/strips'
  });
};

// Other
export const resync = (sendMessage: (message: Message) => void) => {
  sendMessage({
    type: 'subscribe',
    resource: '/audio'
  });
};

export const loadConfig = (
  file: File,
  sendMessage: (message: Message) => void
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
