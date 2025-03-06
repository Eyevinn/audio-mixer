import { FC, PropsWithChildren } from 'react';

const PageContainer: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <div className="text-white flex flex-col w-full h-screen overflow-x-hidden">
      {children}
    </div>
  );
};

export default PageContainer;
