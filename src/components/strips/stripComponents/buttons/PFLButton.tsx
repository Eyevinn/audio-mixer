import { FC, useCallback, useEffect, useState } from 'react';
import { ActionButton } from '../../../ui/buttons/Buttons';
import { useWebSocket } from '../../../../context/WebSocketContext';
import { usePFLMix } from '../../../../hooks/usePFLMix';

interface PFLButtonProps {
  type: 'strips' | 'mixes';
  id: number;
}

const PFLButton: FC<PFLButtonProps> = (props) => {
  const { type, id } = props;
  const { PFLMix, setPFLStripMuted } = usePFLMix();
  const { sendMessage } = useWebSocket();
  const [isStripMuted, setIsStripMuted] = useState<boolean>(true);

  useEffect(() => {
    const isMuted = PFLMix?.inputs?.[type]?.[id]?.muted ?? true;
    setIsStripMuted(isMuted);
  }, [PFLMix, setPFLStripMuted, type, id]);

  const handlePFLChange = useCallback(() => {
    setPFLStripMuted(type, id, !isStripMuted);
    sendMessage({
      type: 'set',
      resource: `/audio/mixes/1000/inputs/${type}/${id}`,
      body: {
        muted: !isStripMuted
      }
    });
  }, [type, id, sendMessage, setPFLStripMuted, isStripMuted]);

  return (
    <ActionButton
      label="PFL"
      buttonColor={isStripMuted ? 'bg-default-btn' : 'bg-pfl-btn'}
      onClick={(e) => {
        e.stopPropagation();
        handlePFLChange();
      }}
    />
  );
};

export default PFLButton;
