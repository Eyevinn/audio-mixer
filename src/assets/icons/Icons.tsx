import {
  IconAdjustments,
  IconAdjustmentsPlus,
  IconArrowsShuffle,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconDownload,
  IconMenu2,
  IconMenuDeep,
  IconPlugConnected,
  IconPlugConnectedX,
  IconSettings,
  IconSTurnRight,
  IconTrash,
  IconUpload
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
  IconTrash: ({ className }: IClassName) => <IconTrash className={className} />,
  IconPlugConnected: ({ className }: IClassName) => (
    <IconPlugConnected className={className} />
  ),
  IconPlugConnectedX: ({ className }: IClassName) => (
    <IconPlugConnectedX className={className} />
  ),
  IconSave: ({ className }: IClassName) => (
    <IconDownload className={className} />
  ),
  IconUpload: ({ className }: IClassName) => (
    <IconUpload className={className} />
  ),
  IconCheck: ({ className }: IClassName) => <IconCheck className={className} />,
  IconChevronDown: ({ className }: IClassName) => (
    <IconChevronDown className={className} />
  ),
  IconSettings: ({ className }: IClassName) => (
    <IconSettings className={className} />
  ),
  IconCopy: ({ className }: IClassName) => <IconCopy className={className} />
};

export type PickIconNames = keyof typeof pickIcon;

interface IIcons {
  name: PickIconNames;
  className: string;
}

export default function Icons({ name, className }: IIcons) {
  return <>{pickIcon[name]({ className })}</>;
}
