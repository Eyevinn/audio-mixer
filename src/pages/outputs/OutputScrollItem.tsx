import { useEffect, useRef, useState } from 'react';
import { OutputStrip } from '../../components/strips/outputStrip/OutputStrip';
import { Select } from '../../components/ui/select/Select';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { TAudioStrip, TMixStrip, TOutput } from '../../types/types';
import {
  addInputToOutput,
  removeInputFromOutput
} from '../../utils/wsCommands';

export interface TOutputScrollItem {
  output: TOutput;
  outputName: string;
  isPFLInactive: boolean | undefined;
  ref?: (el: any) => void;
  onSelect: (stripId: number | null, type: 'mixes' | 'strips') => void;
}

export const OutputScrollItem = ({
  output,
  outputName,
  isPFLInactive,
  ref,
  onSelect
}: TOutputScrollItem) => {
  const [allInputs, setAllInputs] = useState<(TAudioStrip | TMixStrip)[]>([]);
  const { mixes, strips } = useGlobalState();
  const { sendMessage } = useWebSocket();
  const hasRemovedInputRef = useRef<boolean>(false);

  useEffect(() => {
    setAllInputs([...strips, ...mixes]);
  }, [strips, mixes]);

  const handleAddInputToOutput = (
    outputName: string,
    selectedInput: TAudioStrip | TMixStrip
  ) => {
    const isMix = selectedInput.inputs !== undefined;

    addInputToOutput(
      sendMessage,
      outputName,
      selectedInput.stripId,
      'pre_fader',
      isMix ? 'mix' : 'strip'
    );
  };

  const renderLabel = (stripId: number, origin: 'strip' | 'mix') => {
    if (origin === 'strip') {
      const strip = strips.find((strip) => strip.stripId === stripId);
      return `${strip?.label || `Strip ${stripId.toString()}`}`;
    } else if (origin === 'mix') {
      const mix = mixes.find((mix) => mix.stripId === stripId);
      return `${mix?.label || `Mix ${stripId.toString()}`}`;
    } else {
      return 'Select input';
    }
  };

  const renderMixOrStripFromInput = (
    stripId: number,
    origin: 'strip' | 'mix'
  ) => {
    if (origin === 'strip') {
      return strips.find((strip) => strip.stripId === stripId);
    } else if (origin === 'mix') {
      return mixes.find((mix) => mix.stripId === stripId);
    }
  };

  useEffect(() => {
    if (hasRemovedInputRef.current) return;

    const isMix = output.input.source === 'mix';

    const existsInSavedMixes =
      isMix && mixes.some((mix) => mix.stripId === output.input.index);
    const existsInSavedStrips =
      !isMix && strips.some((strip) => strip.stripId === output.input.index);

    if (
      !existsInSavedMixes &&
      !existsInSavedStrips &&
      output.input.index !== 0
    ) {
      removeInputFromOutput(sendMessage, outputName);
      hasRemovedInputRef.current = true;
    }
  }, [output, outputName, mixes, strips, sendMessage]);

  return (
    <div
      ref={ref}
      key={outputName}
      className="flex flex-col space-y-4 items-center border-2 border-modal-bg py-2 px-4 rounded-lg"
    >
      <div className="flex flex-row space-x-2 items-center">
        <span>{outputName}</span>
        {output.input.index === 1000 || outputName === 'pfl' ? (
          <div className="h-10" />
        ) : (
          <Select
            value={
              output.input.index !== 0
                ? renderLabel(output.input.index, output.input.source)
                : 'Select input'
            }
            options={allInputs.filter((input) => input.stripId !== 1000)}
            onChange={(selectedInput) =>
              handleAddInputToOutput(outputName, selectedInput)
            }
            removeInput={() => removeInputFromOutput(sendMessage, outputName)}
          />
        )}
      </div>
      {output.input.index !== 0 && (
        <OutputStrip
          outputName={outputName}
          backgroundColor={
            output.input.source === 'mix' ? 'bg-mix-bg' : 'bg-strip-bg'
          }
          stripId={output.input.index}
          input={output.input}
          meters={output.meters}
          label={output.label || outputName}
          selectedInput={renderMixOrStripFromInput(
            output.input.index,
            output.input.source
          )}
          type={output.input.source === 'mix' ? 'mixes' : 'strips'}
          onStripSelect={onSelect}
          isPFLInactive={isPFLInactive}
        />
      )}
    </div>
  );
};
