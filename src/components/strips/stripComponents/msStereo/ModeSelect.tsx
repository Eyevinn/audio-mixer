import { StripDropdown } from '../../../ui/dropdown/Dropdown';

type TMSStereoProps = {
  isStereo: boolean;
  filters: { enabled: boolean; input_format: string };
  stripId: number;
  handleChange: (
    type: 'strips' | 'mixes',
    id: number,
    property: string,
    value: string | boolean
  ) => void;
};
export const ModeSelect = ({
  isStereo,
  filters,
  stripId,
  handleChange
}: TMSStereoProps) => {
  const renderMSValue = () => {
    if (isStereo) {
      if (filters.enabled && filters.input_format === 'ms_stereo') {
        return 'm/s_stereo';
      } else {
        return 'stereo';
      }
    } else {
      return 'mono';
    }
  };

  return (
    <StripDropdown
      type="Mode"
      options={['mono', 'stereo', 'm/s_stereo']}
      value={renderMSValue()}
      msStereo={true}
      onChange={(mode) => handleChange('strips', stripId, 'mid_side', mode)}
    />
  );
};
