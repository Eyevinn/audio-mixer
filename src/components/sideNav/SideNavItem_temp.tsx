import { TSideNavItem } from './SideNav_temp';
import { SideNavTooltip } from './SideNavTooltip_temp';
import { useNavigate } from 'react-router-dom';
import Icons from '../icons/Icons';

type TSideNavItemBaseProps = {
  isOpen: boolean;
};

export const SideNavItemComponent = (
  props: TSideNavItem & TSideNavItemBaseProps
) => {
  const { link, label, icon, isOpen } = props;
  const navigate = useNavigate();

  return (
    <div
      className="flex p-4 rounded-xl hover:bg-zinc-600 relative group hover:cursor-pointer mb-2 overflow-hidden h-16 w-full space-x-4"
      onClick={() => navigate(link)}
    >
      <Icons name={icon} className="min-w-8 min-h-8" />
      {isOpen && <p className="text-white">{label}</p>}
      <SideNavTooltip label={label} isOpen={isOpen} />
    </div>
  );
};
