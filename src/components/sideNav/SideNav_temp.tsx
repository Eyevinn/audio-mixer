import { useState } from 'react';
import { SideNavItemComponent } from './SideNavItem_temp';
import Icons, { PickIconNames } from '../icons/Icons';

export type TSideNavItem = {
  id: string;
  label: string;
  link: string;
  icon: PickIconNames;
};

export const SideNav = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sideNavItems: TSideNavItem[] = [
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
      id: 'output-mixes',
      label: 'Output Mixes',
      link: '/outputs/output-mixes',
      icon: 'IconSTurnRight'
    },
    {
      id: 'output-mapping',
      label: 'Output Mapping',
      link: '/outputs/output-mapping',
      icon: 'IconArrowsShuffle'
    }
  ];

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`flex flex-col bg-zinc-800 min-w-0 ${
        isOpen ? 'w-[300px]' : 'w-20'
      } h-screen p-2 pt-4 transition-all duration-500 max-w-[350px]`}
    >
      <div className="flex flex-col h-16 mb-6 w-full">
        <div onClick={toggleOpen}>
          <Icons
            name={isOpen ? 'IconMenuDeep' : 'IconMenu2'}
            className="text-white hover:cursor-pointer rounded-xl hover:bg-light min-w-[60px] min-h-16 p-2 place-self-end"
          />
        </div>
        <div
          className={`flex flex-col grow justify-between text-white text-xl`}
        >
          <div className="mt-6">
            {sideNavItems.map((item) => (
              <div key={item.id}>
                <SideNavItemComponent
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  link={item.link}
                  isOpen={isOpen}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
