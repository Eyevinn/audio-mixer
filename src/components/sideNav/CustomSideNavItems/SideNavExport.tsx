import React, { FC } from 'react';
import { SideNavItemComponent, TSideNavItem } from '../SideNavItem';

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

  return <SideNavItemComponent item={ExportItem} isOpen={isOpen} />;
};

export default SideNavExport;
