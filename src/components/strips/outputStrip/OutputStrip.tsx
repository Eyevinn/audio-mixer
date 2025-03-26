import React, { useCallback } from 'react';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { useWebSocket } from '../../../context/WebSocketContext';
import { TOutputStrip } from '../../../types/types';
import { resetOutputMeters } from '../../../utils/wsCommands';
import { BaseStrip } from '../BaseStrip';
import { OutputFields } from './OutputFields';

export interface TOutputStripProps extends TOutputStrip {
  outputName: string;
  backgroundColor: string;
  stripId: number;
  type: 'mixes' | 'strips';
  isPFLInactive: boolean | undefined;
  onStripSelect: (stripId: number | null, type: 'mixes' | 'strips') => void;
}

export const OutputStrip: React.FC<TOutputStripProps> = (props) => {
  const { sendMessage } = useWebSocket();
  const { mixes, strips, setMixes, setStrips, updateOutput } = useGlobalState();

  const originMix = mixes.find((mix) => mix.stripId === props.input.index);
  const originStrip = strips.find(
    (strip) => strip.stripId === props.input.index
  );

  const handleSelection = () => {
    if (originMix && props.type === 'mixes') {
      props.onStripSelect(
        originMix.selected ? null : originMix.stripId,
        'mixes'
      );
    } else if (originStrip && props.type === 'strips') {
      props.onStripSelect(
        originStrip.selected ? null : originStrip.stripId,
        'strips'
      );
    }
  };

  const handleResetMeters = () => {
    resetOutputMeters(sendMessage, props.outputName);
  };

  const handleOutputChange = useCallback(
    (
      id: number,
      property: string,
      value: number | boolean | string | undefined
    ) => {
      if (props.type === 'mixes' && property !== 'label') {
        setMixes(
          mixes.map((mix) =>
            mix.stripId === id ? { ...mix, [property]: value } : mix
          )
        );
      } else if (props.type === 'strips' && property !== 'label') {
        setStrips(
          strips.map((strip) =>
            strip.stripId === id ? { ...strip, [property]: value } : strip
          )
        );
      }

      if (value === undefined) return;

      if (property === 'label') {
        // setLocalLabel(value.toString());
        updateOutput(props.outputName, { label: value });
        sendMessage({
          type: 'set',
          resource: `/audio/outputs/${props.outputName}`,
          body: { [property]: value }
        });
      } else if (property === 'origin') {
        sendMessage({
          type: 'set',
          resource: `/audio/outputs/${props.outputName}/input`,
          body: { origin: value }
        });
      } else if (property === 'volume' || property === 'muted') {
        sendMessage({
          type: 'set',
          resource: `/audio/${props.type}/${id}/fader`,
          body: { [property]: value }
        });
      } else if (property === 'panning') {
        sendMessage({
          type: 'set',
          resource: `/audio/${props.type}/${id}/filters/pan`,
          body: { value: value }
        });
      }
    },
    [
      mixes,
      props.outputName,
      props.type,
      sendMessage,
      setMixes,
      setStrips,
      strips,
      updateOutput
    ]
  );

  return (
    <BaseStrip
      {...(props.input.source === 'mix' ? originMix : originStrip)}
      isOutputStrip={true}
      label={props.label}
      output={props}
      backgroundColor={props.backgroundColor}
      header={`${props.input.source === 'mix' ? 'Mix ' : 'Strip '} ${props.stripId}`}
      handleOutputChange={handleOutputChange}
      onReset={handleResetMeters}
      stripId={props.stripId}
      handleSelection={handleSelection}
      isPFLInactive={props.isPFLInactive}
    >
      {props.outputName !== 'pfl' && (
        <OutputFields source={props.input.source} stripId={props.stripId} />
      )}
    </BaseStrip>
  );
};
