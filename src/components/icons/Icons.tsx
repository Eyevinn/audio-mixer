import {
  IconMenu2,
  IconMenuDeep,
  IconAdjustments,
  IconAdjustmentsPlus,
  IconArrowsShuffle,
  IconSTurnRight,
  IconTrash
} from '@tabler/icons-react';

interface IClassName {
  className: string;
}

const pickIcon = {
  IconMenu2: ({ className }: IClassName) => <IconMenu2 className={className} />,
  IconMenuDeep: ({ className }: IClassName) => (
    <IconMenuDeep className={className} />
  ),
  IconAdjustments: ({ className }: IClassName) => (
    <IconAdjustments className={className} />
  ),
  IconAdjustmentsPlus: ({ className }: IClassName) => (
    <IconAdjustmentsPlus className={className} />
  ),
  IconArrowsShuffle: ({ className }: IClassName) => (
    <IconArrowsShuffle className={className} />
  ),
  IconSTurnRight: ({ className }: IClassName) => (
    <IconSTurnRight className={className} />
  ),
  IconTrash: ({ className }: IClassName) => <IconTrash className={className} />
};

export type PickIconNames = keyof typeof pickIcon;

interface IIcons {
  name: PickIconNames;
  className: string;
}

export default function Icons({ name, className }: IIcons) {
  return <>{pickIcon[name]({ className })}</>;
}
