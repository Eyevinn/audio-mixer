import { FC, PropsWithChildren } from 'react';

const PageContainer: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <div className="text-white text-2xl flex flex-col w-full h-screen overflow-hidden">
      {children}
    </div>
  );
};

export default PageContainer;
