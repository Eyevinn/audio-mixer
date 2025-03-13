import { useNavigate } from 'react-router-dom';
import Icons from '../../../assets/icons/Icons';
import { MixFieldsBtn } from './MixFieldBtn';

type TMixFieldsProps = {
  stripId: number;
  isBeingConfigured?: boolean;
};

export const MixFields = ({ stripId, isBeingConfigured }: TMixFieldsProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <MixFieldsBtn
        isBeingConfigured={isBeingConfigured}
        type={isBeingConfigured ? 'dummy' : 'configure'}
        onClick={() => navigate(`/mixes/${stripId}`, { replace: true })}
      >
        <Icons name="IconSettings" className="w-5 h-5" />
        Configure
      </MixFieldsBtn>
      <MixFieldsBtn isBeingConfigured={isBeingConfigured} type="dummy">
        |
      </MixFieldsBtn>
    </div>
  );
};
