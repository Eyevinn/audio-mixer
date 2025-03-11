import { useWebSocket } from '../../../../context/WebSocketContext';
import handleMSStereoChange from '../../../../utils/handleMSStereoChange';
import { StripDropdown } from '../../../ui/dropdown/Dropdown';

type TMSStereoProps = {
  isStereo: boolean;
  filters: { enabled: boolean; input_format: string };
  stripId: number;
};
export const MSStereo = ({ isStereo, filters, stripId }: TMSStereoProps) => {
  const { sendMessage } = useWebSocket();
  const renderMSValue = () => {
    if (isStereo) {
      if (filters.enabled && filters.input_format === 'ms_stereo') {
        return 'Mid-Side';
      } else if (filters.enabled && filters.input_format === 'lr_stereo') {
        return 'Left-Right';
      } else {
        return 'None';
      }
    } else {
      return 'None';
    }
  };

  return (
    <StripDropdown
      type="MS Stereo"
      options={['None', 'Left-Right', 'Mid-Side']}
      value={renderMSValue()}
      isStereo={isStereo}
      msStereo={true}
      onChange={(msStereo) =>
        handleMSStereoChange(sendMessage, stripId, msStereo)
      }
    />
  );
};
