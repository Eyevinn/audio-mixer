import { useEffect, useState } from 'react';
import { TAudioStrip, TMixStrip } from '../../../../types/types';
import { EffectsSlider } from './EffectsSlider';
import { CompressorVisualisation } from './CompressorVisualisation';
import styles from './filterComponents.module.css';

type TCompressorProps = {
  strip: TAudioStrip | TMixStrip;
  handleEffectChange: (
    filter: string,
    parameter: string,
    value: number
  ) => void;
};

interface compressorState {
  attack: number;
  gain: number;
  knee: number;
  ratio: number;
  release: number;
  threshold: number;
}

const defaultValues = {
  attack: 50,
  gain: 0,
  knee: 0,
  ratio: 0,
  release: 200,
  threshold: 0
};

export const Compressor = ({ strip, handleEffectChange }: TCompressorProps) => {
  const [compressorState, setCompressorState] =
    useState<compressorState>(defaultValues);

  useEffect(() => {
    setCompressorState({
      attack: strip?.filters?.compressor?.attack ?? defaultValues.attack,
      gain: strip?.filters?.compressor?.gain ?? defaultValues.gain,
      knee: strip?.filters?.compressor?.knee ?? defaultValues.knee,
      ratio: strip?.filters?.compressor?.ratio ?? defaultValues.ratio,
      release: strip?.filters?.compressor?.release ?? defaultValues.release,
      threshold:
        strip?.filters?.compressor?.threshold ?? defaultValues.threshold
    });
  }, [strip?.filters?.compressor]);

  const compressorArray = [
    {
      name: 'attack',
      min: 0,
      max: 120,
      step: 1,
      unit: 'ms'
    },
    {
      name: 'gain',
      min: 0,
      max: 30,
      step: 1,
      unit: 'dB'
    },
    {
      name: 'knee',
      min: 0,
      max: 30,
      step: 1,
      unit: 'dB'
    },
    {
      name: 'ratio',
      min: 0,
      max: 30,
      step: 1,
      unit: ':1'
    },
    {
      name: 'release',
      min: 10,
      max: 1000,
      step: 1,
      unit: 'ms'
    },
    {
      name: 'threshold',
      min: -60,
      max: 0,
      step: 1,
      unit: 'dB'
    }
  ];

  return (
    <section className={styles.settingsItem}>
      <h2 className="text-base font-bold mb-2">Compressor</h2>
      <div className="mb-2 ml-2">
        {compressorArray?.map((compressor) => (
          <EffectsSlider
            key={compressor.name}
            id={`compressor_${compressor.name}`}
            text={`${compressor.name.charAt(0).toUpperCase() + compressor.name.slice(1)}:`}
            min={compressor.min}
            max={compressor.max}
            value={compressorState[compressor.name as keyof compressorState]}
            step={compressor.step}
            unit={compressor.unit}
            filter="compressor"
            parameter={compressor.name}
            onChange={handleEffectChange}
            // onChange={(value) => {
            //   handleEffectChange('compressor', compressor.name, value);
            // }}
            // onChange={(value) => {
            //   setCompressorState((prev) => ({
            //     ...prev,
            //     [compressor.name]: value
            //   }));
            //   handleEffectChange('compressor', compressor.name, value);
            // }}
          />
        ))}
      </div>

      <CompressorVisualisation
        threshold={compressorState.threshold}
        ratio={compressorState.ratio}
        kneeWidth={compressorState.knee}
        makeUpGain={compressorState.gain}
      />
    </section>
  );
};
