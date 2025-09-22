import { useState } from 'react';
import Icons from '../../assets/icons/Icons';
import SideNavExport from './CustomSideNavItems/SideNavExport';
import SideNavImport from './CustomSideNavItems/SideNavImport';
import SideNavWebSocketStatus from './CustomSideNavItems/SideNavWebSocketStatus';
import { SideNavLinkItemComponent, TSideNavLinkItem } from './SideNavLinkItem';

const sideNavItems: TSideNavLinkItem[] = [
  {
    id: 'strips',
    label: 'Strips',
    link: '/strips',
    icon: 'IconAdjustments'
  },
  {
    id: 'mixes',
    label: 'Mixes',
    link: '/mixes',
    icon: 'IconAdjustmentsPlus'
  },
  {
    id: 'outputs',
    label: 'Outputs',
    link: '/outputs',
    icon: 'IconArrowsShuffle'
  }
];

export const SideNav = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`flex flex-col flex-shrink-0 bg-zinc-800 min-w-0 ${
        isOpen ? 'w-[300px]' : 'w-20'
      } h-screen p-2 pt-4 transition-all duration-500 max-w-[350px]`}
    >
      <div className="flex flex-row-reverse h-16 mb-6 w-full items-center justify-between">
        <div onClick={toggleOpen}>
          <Icons
            name={isOpen ? 'IconMenuDeep' : 'IconMenu2'}
            className="text-white hover:cursor-pointer rounded-xl hover:bg-light min-w-[60px] min-h-16 p-2 place-self-end"
          />
        </div>
      </div>
      <div className={`flex flex-col grow justify-between text-white text-xl`}>
        <div className="mt-6">
          {sideNavItems.map((item) => (
            <SideNavLinkItemComponent
              key={item.id}
              item={item}
              isOpen={isOpen}
            />
          ))}
        </div>
        <div>
          <SideNavExport isOpen={isOpen} />
          <SideNavImport isOpen={isOpen} />
          <SideNavWebSocketStatus isOpen={isOpen} />
        </div>
      </div>
    </div>
  );
};
