import MuteButton from '../components/strips/stripComponents/buttons/MuteButton';
import PFLButton from '../components/strips/stripComponents/buttons/PFLButton';
import { PanningSlider } from '../components/strips/stripComponents/panningSlider/PanningSlider';
import { ActionButton } from '../components/ui/buttons/Buttons';
import { Filters } from '../types/types';

export const useRenderPanningAndActions = (
  stripId: number,
  type: 'strips' | 'mixes',
  isPFLInput: boolean,
  configMode: boolean,
  handleSelection: () => void,
  selected?: boolean,
  fader?: { muted: boolean; volume: number },
  filters?: Filters,
  config?: number
) => {
  const panningValToPos = (val: number): number => Math.round((val + 1) * 64);

  const renderButtonColor = (label: string) => {
    switch (label) {
      case 'SELECT':
        return selected ? 'bg-select-btn' : 'bg-default-btn';
      default:
        return 'bg-default-btn';
    }
  };

  const renderPanningAndActions = () => {
    if (isPFLInput) return;
    return (
      <div className="flex flex-col">
        {/* Panning Slider */}
        <PanningSlider
          inputValue={panningValToPos(filters ? filters.pan?.value : 0)}
          type={type}
          id={stripId}
          config={config}
        />
        <div className="flex flex-col justify-end">
          {['SELECT'].map((label, index) => (
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
                }
              }}
            />
          ))}
          {!configMode && (
            <MuteButton
              type={type}
              id={stripId}
              muted={fader?.muted}
              config={config}
            />
          )}
          <PFLButton type={type} id={stripId} />
        </div>
      </div>
    );
  };
  return { renderPanningAndActions };
};
