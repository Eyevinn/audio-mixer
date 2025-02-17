import React from 'react';
import Icons from '../../../assets/icons/Icons';
import { PageHeader } from '../../../components/pageLayout/pageHeader/PageHeader';

export const OutputMappingPage = () => {
  return (
    <div className="text-white text-2xl flex flex-col w-full">
      <PageHeader title="Output Mapping">
        {/* Children are addedd here */}
        <button className="w-[2rem] p-2">
          <Icons
            name="IconTrash"
            className="stroke-inherit hover:cursor-pointer rounded-xl hover:bg-light place-self-end"
          />
        </button>
      </PageHeader>
    </div>
  );
};
