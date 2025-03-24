import { JSX, useEffect, useState } from 'react';
import { TOutput } from '../../../../types/types';
import { EbuMeters } from '../../outputStrip/EbuMeters';
import { ResetButton } from '../../outputStrip/ResetButton';
import { AudioLevel } from '../audioLevel/AudioLevel';
import { useSamplingData } from '../../../../context/SamplingDataContext';
import logger from '../../../../utils/logger';

type TMetersProps = {
  isPFLInput: boolean;
  input?: {
    first_channel: number;
    input_slot: number;
    is_stereo: boolean;
    second_channel: number;
  };
  isOutputStrip?: boolean;
  type?: 'mixes' | 'mix' | 'strips' | 'strip';
  id?: number | string;
  isScreenSmall: boolean;
  renderPanningAndActions: () => JSX.Element | undefined;
  onReset?: () => void;
};

interface MetersData {
  left: number;
  right: number;
  ebu_i?: number;
  ebu_m?: number;
  ebu_s?: number;
}

export const Meters = ({
  isPFLInput,
  type,
  id,
  input,
  isOutputStrip,
  isScreenSmall,
  renderPanningAndActions,
  onReset
}: TMetersProps) => {
  const { stripsSamplingData, mixesSamplingData, outputsSamplingData } =
    useSamplingData();
  const [currentData, setCurrentData] = useState<MetersData>({
    left: 0,
    right: 0
  });
  const [isEBUMetersEnabled, setIsEBUMetersEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      if (isOutputStrip) {
        const outputData = outputsSamplingData[id];
        setIsEBUMetersEnabled(outputData?.meters?.enable_ebu_meter);
        setCurrentData({
          left: outputData?.meters?.peak_left,
          right: outputData?.meters?.peak_right,
          ebu_i: outputData?.meters?.ebu_i,
          ebu_m: outputData?.meters?.ebu_m,
          ebu_s: outputData?.meters?.ebu_s
        });
      } else if (type) {
        const data = ['mixes', 'mix'].includes(type)
          ? mixesSamplingData[id]
          : stripsSamplingData[id];
        setCurrentData({
          left: data?.pre_fader_meter?.peak_left,
          right: data?.pre_fader_meter?.peak_right
        });
      }
    }
  }, [
    type,
    id,
    isOutputStrip,
    stripsSamplingData,
    mixesSamplingData,
    outputsSamplingData
  ]);

  return (
    <div
      className={`
        w-full flex justify-evenly
        ${isOutputStrip && isEBUMetersEnabled ? 'flex-col items-center' : ''} 
        ${isScreenSmall && !isOutputStrip ? '' : 'mb-5'}
      `}
    >
      <div className="flex flex-row px-4 space-x-4">
        {/* Audio Levels */}
        {!isPFLInput && (
          <AudioLevel
            isStereo={input?.is_stereo ?? true}
            audioBarData={{
              peak_left: currentData.left,
              peak_right: currentData.right
            }}
          />
        )}

        {!isOutputStrip && renderPanningAndActions()}

        {isEBUMetersEnabled && onReset && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <EbuMeters
              ebu_i={currentData?.ebu_i || 0}
              ebu_m={currentData?.ebu_m || 0}
              ebu_s={currentData?.ebu_s || 0}
            />
            <ResetButton onClick={onReset} />
          </div>
        )}

        {isOutputStrip && !isEBUMetersEnabled && <div className="w-20 h-10" />}
      </div>
    </div>
  );
};
