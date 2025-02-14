import React, { FC } from 'react';
import { SideNavItemComponent, TSideNavItem } from '../SideNavItem';

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

  return <SideNavItemComponent item={ImportItem} isOpen={isOpen} />;
};

export default SideNavImport;
