import React from 'react';

export const PageHeader = ({
  title,
  children,
  titleElement
}: {
  title: string | any;
  children?: React.ReactNode;
  titleElement?: React.ReactNode;
}) => {
  return (
    <div className="flex justify-between w-full p-5 pb-0">
      <div className="flex flex-row items-center space-x-2">
        <h1 className="text-2xl">{title}</h1>
        <span>{titleElement}</span>
      </div>
      {children}
    </div>
  );
};
