import React, { useState } from 'react';
import { AudioLevel } from '../audioLevel/AudioLevel';
import { VolumeSlider } from '../volumeSlider/VolumeSlider';
import { ActionButton } from '../../ui/buttons/Buttons';
import { EbuMeters } from './EbuMeters';

interface MainVolumeProps {
  onVolumeChange: (volume: number) => void;
  onMuteChange: (muted: boolean) => void;
  onResetLUFS: () => void;
}

export const MainVolume: React.FC<MainVolumeProps> = ({
  onVolumeChange,
  onMuteChange,
  onResetLUFS
}) => {
  const [muted, setMuted] = useState(false);
  // TODO: Add LUFS data state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lufsData, setLufsData] = useState<{
    momentary: number | null;
    shortTerm: number | null;
    integrated: number | null;
  }>({
    momentary: null,
    shortTerm: null,
    integrated: null
  });

  return (
    <div className="w-[8rem] h-[50rem] relative inline-block border-[0.1px] rounded-lg border-gray-500">
      {/* Strip Info */}
      <div className="text-sm text-center ml-2 mb-2 text-white">
        Main Volume
      </div>

      {/* EBU Meters */}
      <EbuMeters onResetLUFS={onResetLUFS} lufsData={lufsData} />

      <div className="flex justify-center flex-wrap w-full mt-5">
        <div className="flex mb-5">
          <AudioLevel isStereo={true} />

          <div className="flex flex-col justify-end">
            <ActionButton
              label={'MUTE'}
              buttonColor={muted ? 'bg-mute-red' : 'bg-dark-grey'}
              onClick={(e) => {
                e.stopPropagation();
                setMuted(!muted);
                onMuteChange(!muted);
              }}
            />
          </div>
        </div>

        {/* Volume slider with markers */}
        <VolumeSlider type="master" onVolumeChange={onVolumeChange} />
      </div>
    </div>
  );
};
