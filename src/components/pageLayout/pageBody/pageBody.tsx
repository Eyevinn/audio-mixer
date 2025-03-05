import { FC, PropsWithChildren } from 'react';

const PageBody: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <div className="text-white flex flex-row justify-between w-full flex-1">
      {children}
    </div>
  );
};

export default PageBody;
