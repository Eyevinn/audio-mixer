import { PanningSlider } from '../components/strips/stripComponents/panningSlider/PanningSlider';
import { ActionButton } from '../components/ui/buttons/Buttons';
import { useWebSocket } from '../context/WebSocketContext';
import { Filters } from '../types/types';
import { useHandleChange } from './useHandleChange';

export const useRenderPanningAndActions = (
  stripId: number,
  type: 'strips' | 'mixes',
  isPFLInput: boolean,
  configMode: boolean,
  handleSelection: () => void,
  selected?: boolean,
  isPFLInactive?: boolean,
  fader?: { muted: boolean; volume: number },
  filters?: Filters,
  config?: number
) => {
  const panningValToPos = (val: number): number => Math.round((val + 1) * 64);
  const panningPosToVal = (pos: number): number => pos / 64 - 1.0;
  const { sendMessage } = useWebSocket();
  const { handleChange } = useHandleChange();

  const renderButtonColor = (label: string) => {
    switch (label) {
      case 'SELECT':
        return selected ? 'bg-select-btn' : 'bg-default-btn';
      case 'PFL':
        return !isPFLInactive ? 'bg-pfl-btn' : 'bg-default-btn';
      case 'MUTE':
        if (configMode) {
          return 'invisible';
        } else {
          return fader?.muted ? 'bg-mute-btn' : 'bg-default-btn';
        }
      default:
        return 'bg-default-btn';
    }
  };

  const handlePFLChange = (value: boolean | undefined) => {
    if (value === undefined) return;

    sendMessage({
      type: 'set',
      resource: `/audio/mixes/1000/inputs/${type}/${stripId}`,
      body: {
        muted: value
      }
    });
  };

  const renderPanningAndActions = () => {
    if (isPFLInput) return;
    return (
      <div className="flex flex-col">
        {/* Panning Slider */}
        <PanningSlider
          inputValue={panningValToPos(filters ? filters.pan.value : 0)}
          onChange={(panning) =>
            handleChange(
              type,
              stripId,
              'panning',
              panningPosToVal(panning),
              config
            )
          }
        />
        <div className="flex flex-col justify-end">
          {['SELECT', 'PFL', 'MUTE'].map((label, index) => (
            <ActionButton
              key={index}
              label={label}
              buttonColor={renderButtonColor(label)}
              onClick={(e) => {
                e.stopPropagation();
                switch (label) {
                  case 'SELECT':
                    handleSelection();
                    break;
                  case 'PFL':
                    handlePFLChange(!isPFLInactive);
                    break;
                  case 'MUTE':
                    handleChange(type, stripId, 'muted', !fader?.muted, config);
                    break;
                }
              }}
            />
          ))}
        </div>
      </div>
    );
  };
  return { renderPanningAndActions };
};
