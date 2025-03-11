import { Filters } from '../types/types';

const message = (
  sendMessage: (message: Record<string, unknown>) => void,
  stripId: number,
  body: Partial<Filters['mid_side']>
) => {
  sendMessage({
    type: 'set',
    resource: `/audio/strips/${stripId}/filters/mid_side`,
    body: body
  });
};

const handleMSStereoChange = (
  sendMessage: (message: Record<string, unknown>) => void,
  stripId: number,
  value: string | boolean
) => {
  if (value === 'none') {
    message(sendMessage, stripId, { enabled: false });
  } else {
    message(sendMessage, stripId, {
      enabled: true,
      input_format: value === 'mid-side' ? 'ms_stereo' : 'lr_stereo'
    });
  }
};

export default handleMSStereoChange;
