import React, { useCallback, useEffect, useState } from 'react';
import { useHandleChange } from '../../hooks/useHandleChange';
import { useRenderPanningAndActions } from '../../hooks/useRenderPanningAndActions';
import { TAudioStrip, TBaseStrip, TMixStrip } from '../../types/types';
import { StripDropdown } from '../ui/dropdown/Dropdown';
import { LabelInput } from '../ui/input/Input';
import { Meters } from './stripComponents/meters/Meters';
import { StripHeader } from './stripComponents/stripHeader/StripHeader';
import { VolumeSlider } from './stripComponents/volumeSlider/VolumeSlider';
import { TOutputStripProps } from './outputStrip/OutputStrip';
import MuteButton from './stripComponents/buttons/MuteButton';
import { useGlobalState } from '../../context/GlobalStateContext';

type SendLevelOrigins = 'pre_fader' | 'post_fader';

interface BaseStripProps extends TBaseStrip {
  isBeingConfigured?: boolean;
  isHighlighted?: boolean;
  input?: {
    first_channel: number;
    input_slot: number;
    is_stereo: boolean;
    second_channel: number;
  };
  output?: TOutputStripProps;
  backgroundColor: string;
  header: string;
  copyButton?: boolean;
  config?: number;
  sendLevels?: {
    muted: boolean;
    volume: number;
    origin: SendLevelOrigins;
  };
  isPFLInactive: boolean | undefined;
  isOutputStrip?: boolean;
  removingOutputWarning?: string | string[];
  onReset?: () => void;
  onRemove?: () => void;
  onRemoveFromMix?: (input: TAudioStrip | TMixStrip) => void;
  handleSelection: () => void;
  onCopy?: () => void;
  handleOutputChange?: (
    id: number,
    property: string,
    value: number | boolean | string | undefined
  ) => void;
  children?: React.ReactNode;
}

export const BaseStrip = ({
  isBeingConfigured,
  isHighlighted,
  removingOutputWarning,
  stripId,
  label,
  selected,
  fader,
  filters,
  input,
  output,
  backgroundColor,
  header,
  copyButton,
  config,
  sendLevels,
  isOutputStrip,
  onReset,
  onRemove,
  onRemoveFromMix,
  handleSelection,
  onCopy,
  handleOutputChange,
  children
}: BaseStripProps) => {
  const { updateStrip } = useGlobalState();
  const [isScreenTall, setIsScreenTall] = useState<boolean>(
    window.innerHeight > 1100
  );
  const [isScreenExtraTall, setIsScreenExtraTall] = useState<boolean>(
    window.innerHeight > 1500
  );
  const [isScreenSmall, setIsScreenSmall] = useState<boolean>(
    window.innerHeight < 900
  );

  const configMode =
    sendLevels?.muted !== undefined &&
    sendLevels?.volume !== undefined &&
    sendLevels?.origin !== undefined &&
    config !== undefined;

  const isPFLInput =
    output?.input.index === 1000 && output?.input.source === 'mix';
  const type = header.includes('Mix') ? 'mixes' : 'strips';

  const { renderPanningAndActions } = useRenderPanningAndActions(
    stripId,
    type,
    isPFLInput,
    configMode,
    handleSelection,
    selected,
    fader,
    filters,
    config
  );

  const handleSendLevelOrigin = (val: string) => {
    updateStrip(type, stripId, { origin: val }, config);
    handleChange(type, stripId, 'origin', val, config);
  };

  const { handleChange } = useHandleChange();

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerHeight < 900);
      setIsScreenTall(window.innerHeight > 1100);
      setIsScreenExtraTall(window.innerHeight > 1500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLabelChange = useCallback(
    (updatedLabel: string) => {
      if (isOutputStrip && handleOutputChange) {
        handleOutputChange(stripId, 'label', updatedLabel);
      } else {
        handleChange(type, stripId, 'label', updatedLabel);
      }
    },
    [handleChange, handleOutputChange, isOutputStrip, stripId, type]
  );

  return (
    <div
      className={`box-border flex flex-col relative rounded-lg
        ${backgroundColor}
        ${isScreenTall && 'h-[80%]'}
        ${isScreenExtraTall && 'h-[60%]'}
        ${!isScreenTall && !isScreenExtraTall && 'h-full'}
        ${isScreenTall || !isOutputStrip ? 'w-fit min-w-[180px]' : 'w-56'}
        ${isHighlighted ? 'border-2 border-white' : ''}
        ${isBeingConfigured ? 'border-2 border-white' : ''}
        ${selected && !isBeingConfigured ? 'border-[1px] border-gray-400' : ''}
      `}
    >
      {/* Strip Info */}
      {isOutputStrip ? (
        <div className="h-2" />
      ) : (
        <StripHeader
          header={header}
          label={label || stripId.toString()}
          configMode={configMode}
          copyButton={isBeingConfigured ? undefined : copyButton}
          isRemovingFromMix={configMode}
          isOutputStrip={isOutputStrip}
          onRemove={onRemove}
          onRemoveFromMix={onRemoveFromMix}
          onCopy={onCopy}
          removingOutputWarning={removingOutputWarning}
        />
      )}

      {/* Label Input */}
      {isOutputStrip && <span className="text-xs ml-4">Output label:</span>}
      <LabelInput
        value={label || stripId.toString()}
        isPFLInput={isPFLInput}
        readOnly={isPFLInput}
        onChange={handleLabelChange}
      />

      {/* Audio Strip Fields */}
      {children}

      <div
        className={`
          flex flex-col items-center flex-wrap w-full mt-5
          ${isScreenSmall && !isOutputStrip && header.includes('Strip') && !configMode ? 'scale-[85%] mt-[-30px]' : ''}
        `}
      >
        <Meters
          isPFLInput={isPFLInput}
          type={type}
          isOutputStrip={isOutputStrip}
          id={isOutputStrip ? output?.outputName : stripId}
          EBUMetersAreEnabled={
            isOutputStrip && output?.meters?.enable_ebu_meters
          }
          input={input}
          isScreenSmall={isScreenSmall}
          renderPanningAndActions={renderPanningAndActions}
          onReset={onReset}
        />

        {/* Volume Slider */}
        <div
          className={`
            flex pt-2 pb-5 w-full items-center
            ${output?.meters.enable_ebu_meters ? 'flex-row justify-center space-x-8 px-4' : 'flex-col'}
            ${configMode ? 'border border-selected-mix-border rounded-b-lg bg-dark-purple absolute bottom-0 left-0' : ''}
            ${isOutputStrip ? 'absolute bottom-0' : ''}
          `}
        >
          {/* Config Fields */}
          {configMode && (
            <StripDropdown
              options={['pre_fader', 'post_fader']}
              value={sendLevels?.origin || ''}
              onChange={handleSendLevelOrigin}
            />
          )}
          {configMode && <p className="text-base pb-2 mt-2">Receive Level</p>}

          <div
            className={`flex flex-col space-y-4 w-full items-center ${isScreenSmall ? 'scale-90 mb-[-20px]' : ''}`}
          >
            <div className="flex flex-row items-center justify-center space-x-8">
              {!isScreenTall && isOutputStrip && renderPanningAndActions()}

              <VolumeSlider
                isDisabled={
                  output && output.input.origin === 'pre_fader' && !isPFLInput
                }
                inputVolume={configMode ? sendLevels?.volume : fader?.volume}
                type={type}
                id={stripId}
                config={config}
              />
            </div>

            {configMode && (
              <MuteButton
                type={type}
                id={stripId}
                config={config}
                muted={sendLevels?.muted}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
