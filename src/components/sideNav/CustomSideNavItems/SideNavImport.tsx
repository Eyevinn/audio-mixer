import { FC, useRef } from 'react';
import { SideNavItemComponent, TSideNavItem } from '../SideNavItem';
import uploadFromFile from '../../../utils/upload-from-file';
import { useWebSocket } from '../../../context/WebSocketContext';

const ImportItem: TSideNavItem = {
  id: 'import',
  label: 'Import',
  icon: 'IconUpload'
};

interface SideNavImportProps {
  isOpen: boolean;
}

const SideNavImport: FC<SideNavImportProps> = (props) => {
  const { isOpen } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useWebSocket();

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        id="file-input"
        hidden
        ref={inputRef}
        onChange={(event) => {
          uploadFromFile(event, sendMessage);
        }}
      />
      <SideNavItemComponent
        item={ImportItem}
        isOpen={isOpen}
        onClick={handleClick}
      />
    </>
  );
};

export default SideNavImport;
