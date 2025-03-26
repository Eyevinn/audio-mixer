import { FC } from 'react';
import { ActionButton } from '../../../ui/buttons/Buttons';
import { useHandleChange } from '../../../../hooks/useHandleChange';
import { useGlobalState } from '../../../../context/GlobalStateContext';

interface MuteButtonProps {
  type: 'strips' | 'mixes';
  id: number;
  muted?: boolean;
  config?: number;
}

const MuteButton: FC<MuteButtonProps> = (props) => {
  const { type, id, muted, config } = props;
  const { handleChange } = useHandleChange();
  const { updateStrip } = useGlobalState();

  const handleMuteChange = () => {
    updateStrip(type, id, { fader: { muted: !muted } });
    handleChange(type, id, 'muted', !muted, config);
  };

  return (
    <ActionButton
      label="MUTE"
      buttonColor={muted ? 'bg-mute-btn' : 'bg-default-btn'}
      onClick={(e) => {
        e.stopPropagation();
        handleMuteChange();
      }}
    />
  );
};

export default MuteButton;
