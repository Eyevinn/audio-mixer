import { JSX } from 'react';
import { Filters, TOutput } from '../../../../types/types';
import { EbuMeters } from '../../outputStrip/EbuMeters';
import { ResetButton } from '../../outputStrip/ResetButton';
import { AudioLevel } from '../audioLevel/AudioLevel';

type TMetersProps = {
  isPFLInput: boolean;
  output?: TOutput;
  input?: {
    first_channel: number;
    input_slot: number;
    is_stereo: boolean;
    second_channel: number;
  };
  pre_fader_meter?: {
    peak_left: number;
    peak_right: number;
  };
  isOutputStrip?: boolean;
  showEbuMeters?: boolean;
  isScreenSmall: boolean;
  filters?: Filters;
  renderPanningAndActions: () => JSX.Element | undefined;
  onReset?: () => void;
};

export const Meters = ({
  isPFLInput,
  output,
  input,
  pre_fader_meter,
  isOutputStrip,
  showEbuMeters,
  isScreenSmall,
  filters,
  renderPanningAndActions,
  onReset
}: TMetersProps) => {
  return (
    <div
      className={`
        w-full flex justify-evenly
        ${isOutputStrip && output?.meters.enable_ebu_meters ? 'flex-col items-center' : ''} 
        ${isScreenSmall && !isOutputStrip ? '' : 'mb-5'}
      `}
    >
      <div className="flex flex-row px-4 space-x-4">
        {/* Audio Levels */}
        {!isPFLInput && (
          <AudioLevel
            isStereo={input?.is_stereo ?? true}
            audioBarData={{
              peak_left: isOutputStrip
                ? output?.meters.peak_left
                : pre_fader_meter?.peak_left,
              peak_right: isOutputStrip
                ? output?.meters.peak_right
                : pre_fader_meter?.peak_right
            }}
          />
        )}

        {!isOutputStrip &&
          filters &&
          filters.pan.value &&
          renderPanningAndActions()}

        {showEbuMeters && output && onReset && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <EbuMeters
              ebu_i={output?.meters.ebu_i}
              ebu_m={output?.meters.ebu_m}
              ebu_s={output?.meters.ebu_s}
            />
            <ResetButton onClick={onReset} />
          </div>
        )}

        {isOutputStrip && !showEbuMeters && <div className="w-20 h-10" />}
      </div>
    </div>
  );
};
