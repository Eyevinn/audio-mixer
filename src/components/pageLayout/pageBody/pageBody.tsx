import { FC, PropsWithChildren } from 'react';

const PageBody: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <div className="text-white flex flex-row justify-between w-full h-[calc(100vh-4rem)] pb-5">
      {children}
    </div>
  );
};

export default PageBody;
