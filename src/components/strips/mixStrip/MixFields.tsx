import React from 'react';
import Icons from '../../../assets/icons/Icons';
import { MixFieldsBtn } from './MixFieldBtn';
type TMixFieldsProps = {
  stripId: number;
};

export const MixFields = ({ stripId }: TMixFieldsProps) => {
  // TODO: connect id to the configure mix-page
  console.log('stripId', stripId);
  return (
    <div>
      <MixFieldsBtn type="configure">
        <Icons name="IconSettings" className="w-5 h-5" />
        Configure
      </MixFieldsBtn>
      <MixFieldsBtn type="dummy">|</MixFieldsBtn>
      <MixFieldsBtn type="dummy">|</MixFieldsBtn>
      <MixFieldsBtn type="dummy">|</MixFieldsBtn>
    </div>
  );
};
