import React from 'react';

type TMixFieldsBtnProps = {
  type: 'configure' | 'dummy';
  children: React.ReactNode;
  isBeingConfigured?: boolean;
  onClick?: () => void;
};

export const MixFieldsBtn = ({
  type,
  children,
  isBeingConfigured,
  onClick
}: TMixFieldsBtnProps) => {
  return (
    <div className="w-full px-4 py-1 items-center">
      <button
        type="button"
        className={`flex w-full px-4 gap-1 items-center bg-input-field text-black outline-none text-center py-1 text-sm rounded ${type === 'configure' ? 'bg-input-field text-black cursor-pointer' : isBeingConfigured ? 'bg-selected-mix-bg text-selected-mix-bg cursor-default' : 'bg-mix-bg text-mix-bg cursor-grab'}`}
        onClick={type === 'configure' && onClick ? onClick : undefined}
      >
        {children}
      </button>
    </div>
  );
};
