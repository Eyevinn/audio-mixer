import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import { Select } from '../../components/ui/select/Select';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { TAudioStrip, TMixStrip } from '../../types/types';
import { addInputToOutput } from '../../utils/utils';
import PageContainer from '../../components/pageLayout/pageContainer/PageContainer';

export const OutputMappingPage = () => {
  const [allInputs, setAllInputs] = useState<(TAudioStrip | TMixStrip)[]>([]);
  const { strips, mixes, outputs } = useGlobalState();
  const { sendMessage } = useWebSocket();

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

  const renderLabel = (stripId: number, inputType: 'strip' | 'mix') => {
    if (inputType === 'strip') {
      const strip = strips.find((strip) => strip.stripId === stripId);
      return `Strip ${strip?.label || stripId.toString()}`;
    } else if (inputType === 'mix') {
      const mix = mixes.find((mix) => mix.stripId === stripId);
      return `Mix ${mix?.label || stripId.toString()}`;
    } else {
      return 'Select input';
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Outputs" />
      <div className="flex flex-wrap gap-6 ml-8 mt-8">
        {Object.entries(outputs).map(([key, output]) => {
          return (
            <div key={key} className="flex flex-col space-y-2">
              <span>{key}</span>
              <Select
                value={
                  output.input.index !== 0
                    ? renderLabel(output.input.index, output.input.source)
                    : 'Select input'
                }
                options={allInputs}
                onChange={(selectedInput) =>
                  handleAddInputToOutput(key, selectedInput)
                }
              />
              {/* TODO: Add Output Mix/Strip component */}
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
};
