import { FC, useEffect } from 'react';
import { SideNavItemComponent, TSideNavItem } from '../SideNavItem';
import { useWebSocket } from '../../../context/WebSocketContext';
import { getAudioRoot } from '../../../utils/utils';
import saveToFile from '../../../utils/save-to-file';

const ExportItem: TSideNavItem = {
  id: 'export',
  label: 'Export',
  icon: 'IconSave'
};

interface SideNavExportProps {
  isOpen: boolean;
}

const SideNavExport: FC<SideNavExportProps> = (props) => {
  const { isOpen } = props;
  const { sendMessage, audioState, clearAudioState } = useWebSocket();

  const handleClick = () => {
    getAudioRoot(sendMessage);
  };

  useEffect(() => {
    if (audioState && clearAudioState) {
      saveToFile(audioState);
      clearAudioState();
    }
  }, [audioState, clearAudioState]);

  return (
    <SideNavItemComponent
      item={ExportItem}
      isOpen={isOpen}
      onClick={handleClick}
    />
  );
};

export default SideNavExport;
