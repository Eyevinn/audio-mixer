import { JSX } from 'react';
import { TOutput } from '../../../../types/types';
import { ResetButton } from '../../outputStrip/ResetButton';
import { AudioLevel } from '../audioLevel/AudioLevel';
import { EbuMeters } from '../../outputStrip/EbuMeters';

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
  isScreenTall: boolean;
  showEbuMeters?: boolean;
  isScreenSmall: boolean;
  renderPanningAndActions: () => JSX.Element | undefined;
  onReset?: () => void;
};

export const Meters = ({
  isPFLInput,
  output,
  input,
  pre_fader_meter,
  isOutputStrip,
  isScreenTall,
  showEbuMeters,
  isScreenSmall,
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
      <div
        className={`${isScreenTall ? '' : 'scale-90'} flex flex-row space-x-4 px-4`}
      >
        {/* Audio Levels */}
        {!isPFLInput && !output?.meters.enable_ebu_meters && (
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

        {!showEbuMeters && renderPanningAndActions()}

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

        {!isScreenTall && showEbuMeters && renderPanningAndActions()}
      </div>
    </div>
  );
};
