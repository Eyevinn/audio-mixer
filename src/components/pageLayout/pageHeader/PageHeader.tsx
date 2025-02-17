import React from 'react';

export const PageHeader = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex justify-between w-full p-5 pb-0">
      <h1 className="text-2xl">{title}</h1>
      {children}
    </div>
  );
};
