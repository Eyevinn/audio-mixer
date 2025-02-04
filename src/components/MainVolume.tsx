import React, { useState } from 'react';
import { AudioLevel } from './AudioLevel';
import { VolumeSlider } from './volumeSlider/VolumeSlider';
import { ActionButton } from './buttons/Buttons';

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
    <div className="w-[95px] h-[726px] relative inline-block">
      <div className="w-full relative">
        <div className="text-sm text-center mb-2 text-white">Main Volume</div>

        <div className="h-[214px]">
          <p className="text-xs text-white m-0">EBU R 128 M:</p>
          <p className="text-xs mb-3.5 text-white">
            {typeof lufsData.momentary === 'number'
              ? `${lufsData.momentary.toFixed(1)} LUFS`
              : '- LUFS'}
          </p>

          <button
            onClick={onResetLUFS}
            className="text-xl text-white bg-transparent border-none cursor-pointer"
          >
            ⟳
          </button>
        </div>

        <div className="flex pb-4">
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

        <div className="relative w-[72px] h-[346px] ml-[5px]">
          {/* Volume slider with markers */}
          <VolumeSlider type="master" onVolumeChange={onVolumeChange} />
        </div>
      </div>
    </div>
  );
};
