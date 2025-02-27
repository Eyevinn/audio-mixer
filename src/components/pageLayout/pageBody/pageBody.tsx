import { FC, PropsWithChildren } from 'react';

const PageBody: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <div className="text-white text-2xl flex flex-row justify-between w-full h-full">
      {children}
    </div>
  );
};

export default PageBody;
