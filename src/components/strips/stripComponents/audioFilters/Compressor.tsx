import { useState } from 'react';
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

export const Compressor = ({ strip, handleEffectChange }: TCompressorProps) => {
  const [compressorState, setCompressorState] = useState({
    threshold: 0,
    ratio: 4,
    knee: 2,
    makeUpGain: 0
  });

  const compressorArray = strip.filters && [
    {
      name: 'attack',
      min: 0,
      max: 120,
      value: strip.filters.compressor.attack,
      step: 1,
      unit: 'ms'
    },
    {
      name: 'gain',
      min: 0,
      max: 30,
      value: strip.filters.compressor.gain,
      step: 1,
      unit: 'dB'
    },
    {
      name: 'knee',
      min: 0,
      max: 30,
      value: strip.filters.compressor.knee,
      step: 1,
      unit: 'dB'
    },
    {
      name: 'ratio',
      min: 0,
      max: 30,
      value: strip.filters.compressor.ratio,
      step: 1,
      unit: ':1'
    },
    {
      name: 'release',
      min: 10,
      max: 1000,
      value: strip.filters.compressor.release,
      step: 1,
      unit: 'ms'
    },
    {
      name: 'threshold',
      min: -60,
      max: 0,
      value: strip.filters.compressor.threshold,
      step: 1,
      unit: 'dB'
    }
  ];

  return (
    <section className={styles.settingsItem}>
      <h2 className="text-base font-bold mb-2">Compressor</h2>
      <div className="mb-2 ml-2">
        {compressorArray &&
          compressorArray.map((compressor) => (
            <EffectsSlider
              key={compressor.name}
              id={`compressor_${compressor.name}`}
              text={`${compressor.name.charAt(0).toUpperCase() + compressor.name.slice(1)}:`}
              min={compressor.min}
              max={compressor.max}
              value={compressor.value}
              step={compressor.step}
              unit={compressor.unit}
              filter="compressor"
              parameter={compressor.name}
              onChange={(value) => {
                setCompressorState((prev) => ({
                  ...prev,
                  [compressor.name]: value
                }));
                handleEffectChange('compressor', compressor.name, value);
              }}
            />
          ))}
      </div>

      <CompressorVisualisation
        threshold={compressorState.threshold}
        ratio={compressorState.ratio}
        kneeWidth={compressorState.knee}
        makeUpGain={compressorState.makeUpGain}
      />
    </section>
  );
};
