import React from 'react';

export const PageHeader = ({
  title,
  children,
  titleElement
}: {
  title: string;
  children?: React.ReactNode;
  titleElement?: React.ReactNode;
}) => {
  return (
    <div className="overflow-x-hidden flex justify-between w-full items-center p-5 pb-0 h-[75px]">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="text-2xl">{title}</h1>
        <span>{titleElement}</span>
      </div>
      {children}
    </div>
  );
};
