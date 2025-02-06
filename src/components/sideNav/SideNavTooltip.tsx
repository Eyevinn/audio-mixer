type TSideNavTooltipProps = {
  label?: string;
  isOpen: boolean;
  className?: string;
};

export const SideNavTooltip = (props: TSideNavTooltipProps) => {
  const { label, isOpen, className } = props;

  if (isOpen) return <></>;

  return (
    <span
      className={`absolute flex flex-col justify-center items-center bg-zinc-600 left-20 top-[50%] translate-y-[-50%] h-16 p-4 whitespace-nowrap z-50 rounded-xl text-white invisible group-hover:visible ${className}`}
    >
      {label}
    </span>
  );
};
