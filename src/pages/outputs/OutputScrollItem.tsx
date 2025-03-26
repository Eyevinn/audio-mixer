import { useEffect, useRef, useState } from 'react';
import { OutputStrip } from '../../components/strips/outputStrip/OutputStrip';
import Checkbox from '../../components/ui/checkbox/Checkbox';
import { StripDropdown } from '../../components/ui/dropdown/Dropdown';
import { Select } from '../../components/ui/select/Select';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { TAudioStrip, TMixStrip, TOutput } from '../../types/types';
import {
  addInputToOutput,
  enableEbuMeters,
  removeInputFromOutput
} from '../../utils/wsCommands';

export interface TOutputScrollItem {
  output: TOutput;
  outputName: string;
  isPFLInactive: boolean | undefined;
  ref?: (el: HTMLDivElement | null) => void;
  onSelect: (stripId: number | null, type: 'mixes' | 'strips') => void;
}

export const OutputScrollItem = ({
  output: outputProp,
  outputName,
  isPFLInactive,
  ref,
  onSelect
}: TOutputScrollItem) => {
  const [output, setOutput] = useState<TOutput>(outputProp);
  const [allInputs, setAllInputs] = useState<(TAudioStrip | TMixStrip)[]>([]);
  const [selectedInput, setSelectedInput] = useState<TAudioStrip | TMixStrip>();
  const { mixes, strips, updateOutput } = useGlobalState();
  const { sendMessage } = useWebSocket();
  const hasRemovedInputRef = useRef<boolean>(false);

  useEffect(() => {
    setOutput(outputProp);
  }, [outputProp]);

  useEffect(() => {
    const sortedInputs = [...mixes, ...strips].sort((a, b) => {
      const isAMix = 'inputs' in a;
      const isBMix = 'inputs' in b;

      if (isAMix && !isBMix) return -1;
      if (!isAMix && isBMix) return 1;
      return 0;
    });

    setAllInputs(sortedInputs);
  }, [strips, mixes]);

  const handleAddInputToOutput = (
    outputName: string,
    selectedInput: TAudioStrip | TMixStrip
  ) => {
    const isMix = selectedInput.inputs !== undefined;

    updateOutput(outputName, {
      input: {
        source: isMix ? 'mix' : 'strip',
        index: selectedInput.stripId
      }
    });
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

  useEffect(() => {
    if (output.input.source === 'strip') {
      setSelectedInput(
        strips.find((strip) => strip.stripId === output.input.index)
      );
    } else if (output.input.source === 'mix') {
      setSelectedInput(mixes.find((mix) => mix.stripId === output.input.index));
    }
  }, [mixes, output, strips]);

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
      updateOutput(outputName, {
        input: {
          index: 0,
          origin: 'post_fader',
          source: 'mix'
        }
      });
      removeInputFromOutput(sendMessage, outputName);
      hasRemovedInputRef.current = true;
    }
  }, [output, outputName, mixes, strips, sendMessage, updateOutput]);

  const handleOriginChange = (origin: 'pre_fader' | 'post_fader') => {
    updateOutput(outputName, {
      input: {
        origin: origin
      }
    });
    sendMessage({
      type: 'set',
      resource: `/audio/outputs/${outputName}/input`,
      body: { origin: origin }
    });
  };

  return (
    <div
      ref={ref}
      key={outputName}
      className="flex flex-col space-y-4 items-center border-2 border-modal-bg py-2 px-4 rounded-lg"
    >
      <div
        className={`flex flex-row space-x-2 ${output.input.index === 1000 ? '' : 'items-center'}`}
      >
        <span>{outputName}</span>
        {output.input.index === 1000 || outputName === 'pfl' ? (
          <div className="h-36" />
        ) : (
          <Select
            isOutputPage={true}
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

      {output.input.index !== 1000 && output.input.index !== 0 && (
        <StripDropdown
          value={output.input.origin}
          onChange={(origin) =>
            handleOriginChange(origin as 'pre_fader' | 'post_fader')
          }
          isOutputStrip={true}
          options={['pre_fader', 'post_fader']}
        />
      )}

      {output.input.index !== 1000 && output.input.index !== 0 && (
        <Checkbox
          label="Enable EBU meters for output"
          checked={!!output?.meters?.enable_ebu_meters}
          onChange={() => {
            const newValue = !output?.meters?.enable_ebu_meters;
            updateOutput(outputName, {
              meters: {
                ...output.meters,
                enable_ebu_meters: newValue
              }
            });
            enableEbuMeters(sendMessage, outputName, newValue);
          }}
        />
      )}

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
          selectedInput={selectedInput}
          type={output.input.source === 'mix' ? 'mixes' : 'strips'}
          onStripSelect={onSelect}
          isPFLInactive={isPFLInactive}
        />
      )}
    </div>
  );
};
