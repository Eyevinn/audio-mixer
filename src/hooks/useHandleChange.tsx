import { useWebSocket } from '../context/WebSocketContext';
import { useGlobalState } from '../context/GlobalStateContext';

export const useHandleChange = () => {
  const { sendMessage } = useWebSocket();
  const { mixes, strips, setMixes, setStrips } = useGlobalState();

  const handleChange = (
    type: 'strips' | 'mixes',
    stripId: number,
    property: string,
    value: number | boolean | string | undefined,
    configId?: number
  ) => {
    const isSendLevelProperty =
      configId &&
      (property === 'volume' || property === 'muted' || property === 'origin');

    const stripIdToUse = configId ? configId : stripId;

    if (isSendLevelProperty) {
      setMixes(
        mixes.map((mix) =>
          mix.stripId === stripId
            ? {
                ...mix,
                inputs: {
                  ...mix.inputs,
                  [type]: {
                    ...mix.inputs[type],
                    [configId]: {
                      ...mix.inputs[type][configId],
                      [property]: value
                    }
                  }
                }
              }
            : mix
        )
      );
    } else if (type === 'mixes') {
      setMixes(
        mixes.map((mix) =>
          mix.stripId === stripIdToUse ? { ...mix, [property]: value } : mix
        )
      );
    } else if (type === 'strips') {
      setStrips(
        strips.map((strip) =>
          strip.stripId === stripIdToUse
            ? { ...strip, [property]: value }
            : strip
        )
      );
    }

    // If the value is undefined, do not send the message.
    // Needed for the input fields, so the input fields can be cleared
    if (value === undefined) return;

    if (property === 'label') {
      sendMessage({
        type: 'set',
        resource: `/audio/${type}/${stripId}`,
        body: { [property]: value }
      });
    } else if (
      property === 'input_slot' ||
      property === 'is_stereo' ||
      property === 'first_channel' ||
      property === 'second_channel'
    ) {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/input`,
        body: { [property]: value }
      });
    } else if (property === 'mid_side') {
      if (value === 'mono') {
        sendMessage({
          type: 'set',
          resource: `/audio/strips/${stripId}/filters/mid_side`,
          body: { enabled: false }
        });
        sendMessage({
          type: 'set',
          resource: `/audio/strips/${stripId}/input`,
          body: { is_stereo: false }
        });
      } else {
        console.log('value', value);
        sendMessage({
          type: 'set',
          resource: `/audio/strips/${stripId}/filters/mid_side`,
          body: { enabled: value === 'm/s_stereo' }
        });
        sendMessage({
          type: 'set',
          resource: `/audio/strips/${stripId}/input`,
          body: { is_stereo: true }
        });
      }
    } else if (!configId && (property === 'volume' || property === 'muted')) {
      sendMessage({
        type: 'set',
        resource: `/audio/${type}/${stripId}/fader`,
        body: { [property]: value }
      });
    } else if (isSendLevelProperty) {
      sendMessage({
        type: 'set',
        resource: `/audio/mixes/${stripIdToUse}/inputs/${type}/${stripId}`,
        body: { [property]: value }
      });
    } else if (property === 'panning') {
      sendMessage({
        type: 'set',
        resource: `/audio/${type}/${stripId}/filters/pan`,
        body: { value: value }
      });
    }
  };

  return { handleChange };
};
