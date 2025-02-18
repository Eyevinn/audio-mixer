import React from 'react';

type TMixFieldsBtnProps = {
  type: 'configure' | 'dummy';
  children: React.ReactNode;
};

export const MixFieldsBtn = ({ type, children }: TMixFieldsBtnProps) => {
  return (
    <div className="w-full px-4 py-1 items-center">
      <button
        type="button"
        className={`flex w-full px-4 gap-1 items-center bg-input-field text-black outline-none text-center py-1 text-sm rounded ${type === 'configure' ? 'bg-input-field text-black cursor-pointer' : 'bg-mix-bg text-mix-bg cursor-grab'}`}
        // TODO: add onClick handler for navigating to configure mix-page
        onClick={() =>
          type === 'configure'
            ? console.log('configure mix-page for strip')
            : ''
        }
      >
        {children}
      </button>
    </div>
  );
};
