import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SideNavItemComponent, TSideNavItem } from './SideNavItem';

export type TSideNavLinkItem = TSideNavItem & {
  link: string;
};

type SideNavLinkItemComponentProps = {
  isOpen: boolean;
  item: TSideNavLinkItem;
};

export const SideNavLinkItemComponent = (
  props: SideNavLinkItemComponentProps
) => {
  const { item, isOpen } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const isActive =
    location.pathname === item.link ||
    location.pathname.startsWith(`${item.link}/`);

  return (
    <SideNavItemComponent
      item={item}
      isOpen={isOpen}
      onClick={() => navigate(item.link)}
      className={`${isActive ? 'bg-zinc-500' : ''}`}
    />
  );
};
