import { SideNavTooltip } from './SideNavTooltip';
import Icons, { PickIconNames } from '../../assets/icons/Icons';

export type TSideNavItem = {
  id: string;
  label: string;
  icon: PickIconNames;
};

export type SideNavItemComponentProps = {
  isOpen: boolean;
  item: TSideNavItem;
  onClick?: () => void;
  className?: string;
};

export const SideNavItemComponent = (props: SideNavItemComponentProps) => {
  const { item, isOpen, onClick, className } = props;

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div className="relative group">
      <div
        className={`flex p-4 rounded-xl hover:bg-zinc-600 hover:cursor-pointer mb-2 overflow-hidden h-16 w-full space-x-4 items-center ${className} `}
        onClick={handleClick}
      >
        <Icons name={item.icon} className="min-w-8 min-h-8" />
        <p className="text-white">{item.label}</p>
      </div>
      <SideNavTooltip label={item.label} isOpen={isOpen} />
    </div>
  );
};
