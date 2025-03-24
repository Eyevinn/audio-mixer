import { FC, useState } from 'react';
import { ActionButton } from '../../../ui/buttons/Buttons';
import { useHandleChange } from '../../../../hooks/useHandleChange';

interface MuteButtonProps {
  type: 'strips' | 'mixes';
  id: number;
  initMuted?: boolean;
  config?: number;
}

const MuteButton: FC<MuteButtonProps> = (props) => {
  const { type, id, initMuted, config } = props;
  const { handleChange } = useHandleChange();
  const [isMuted, setIsMuted] = useState<boolean>(!!initMuted);

  const handleMuteChange = () => {
    setIsMuted(!isMuted);
    handleChange(type, id, 'muted', !isMuted, config);
  };

  return (
    <ActionButton
      label="MUTE"
      buttonColor={isMuted ? 'bg-mute-btn' : 'bg-default-btn'}
      onClick={(e) => {
        e.stopPropagation();
        handleMuteChange();
      }}
    />
  );
};

export default MuteButton;
