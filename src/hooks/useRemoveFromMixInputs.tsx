import { useGlobalState } from '../context/GlobalStateContext';
import { useWebSocket } from '../context/WebSocketContext';
import { removeInputFromMix } from '../utils/wsCommands';

export const useRemoveFromMixInputs = () => {
  const { sendMessage } = useWebSocket();
  const { mixes } = useGlobalState();

  const removeFromMixInputs = (
    mixId: number,
    type: 'mixes' | 'strips',
    isDeletingAll?: boolean
  ) => {
    mixes.forEach((mix) => {
      if (isDeletingAll && mix.stripId !== 1000) return;
      const inputTypes = [
        { inputType: 'mixes', input: mix.inputs?.mixes },
        { inputType: 'strips', input: mix.inputs?.strips }
      ];
      inputTypes.forEach(({ inputType, input }) => {
        Object.entries(input).forEach(([key]) => {
          if (inputType === type && key === mixId.toString()) {
            return removeInputFromMix(
              sendMessage,
              mix.stripId,
              parseInt(key),
              type
            );
          }
        });
      });
    });
  };

  return { removeFromMixInputs };
};
