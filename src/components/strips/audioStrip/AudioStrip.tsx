import React from 'react';
import { BaseStrip } from '../BaseStrip';
import { StripFields } from './StripFields';
import { useWebSocket } from '../../../context/WebSocketContext';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { AudioLevel } from '../audioLevel/AudioLevel';
import { VolumeSlider } from '../volumeSlider/VolumeSlider';
import { PanningSlider } from '../panningSlider/PanningSlider';
import { ActionButton } from '../../ui/buttons/Buttons';
import { StripHeader } from '../stripHeader/StripHeader';
import { useWebSocket } from '../../../context/WebSocketContext';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { LabelInput } from '../../ui/input/Input';
import { InputFields } from './InputFields';
import { Filters } from '../../../types/types';
import { LabelInput, StripInput } from '../../ui/input/Input';
interface AudioStripProps {
  stripId: number;
  label: string;
  selected: boolean;
  pfl: boolean;
  fader: {
    volume: number;
    muted: boolean;
  };
  filters: Filters;
  input: {
    first_channel: number;
    input_slot: number;
    is_stereo: boolean;
    second_channel: number;
  };
  input_meter: {
    peak?: number;
    peak_left?: number;
    peak_right?: number;
  };
  post_fader_meter: {
    peak_left: number;
    peak_right: number;
  };
  pre_fader_meter: {
    peak_left: number;
    peak_right: number;
  };
  onSelect: () => void;
  onRemove: () => void;
}

export const AudioStrip: React.FC<AudioStripProps> = (props) => {
  const { sendMessage } = useWebSocket();
  const { savedStrips, setSavedStrips } = useGlobalState();

  const handleStripChange = (
    stripId: number,
    property: string,
    value: number | boolean | string | undefined
  ) => {
    setSavedStrips(
      savedStrips.map((strip) =>
        strip.stripId === stripId ? { ...strip, [property]: value } : strip
      )
    );

    if (!value) return;
    if (property === 'selected') return;

    if (property === 'label') {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}`,
        body: { [property]: value }
      });
    } else {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/input`,
        body: { [property]: value }
      });
    } else if (property === 'volume' || property === 'muted') {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/fader`,
        body: { [property]: value }
      });
    } else if (property === 'panning') {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/filters/pan`,
        body: { value: value }
      });
    }
  };

  return (
    <BaseStrip
      {...props}
      backgroundColor="bg-strip-bg"
      header={`Strip #${props.slot}`}
      handleStripChange={handleStripChange}
    >
      <StripFields
        slot={props.slot.toString()}
        mode={props.mode}
        channel1={props.channel1.toString()}
        channel2={props.channel2.toString()}
        stripId={props.id}
        handleStripChange={handleStripChange}
      />
    </BaseStrip>
  );
};
