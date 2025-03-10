import { useNavigate } from 'react-router-dom';
import Icons from '../../../assets/icons/Icons';
import { MixFieldsBtn } from '../mixStrip/MixFieldBtn';

type TOutputFieldsProps = {
  stripId: number;
  source: 'strip' | 'mix';
};

export const OutputFields = ({ stripId, source }: TOutputFieldsProps) => {
  const navigate = useNavigate();

  return (
    <div>
      {source === 'mix' && (
        <MixFieldsBtn
          type="configure"
          onClick={() => navigate(`/mixes/${stripId}`, { replace: true })}
        >
          <Icons name="IconSettings" className="w-5 h-5" />
          Configure
        </MixFieldsBtn>
      )}
      {source === 'strip' && (
        <MixFieldsBtn backgroundColor="bg-strip-bg" type="dummy">
          |
        </MixFieldsBtn>
      )}
    </div>
  );
};
