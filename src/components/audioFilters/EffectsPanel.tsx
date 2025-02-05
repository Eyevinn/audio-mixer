import React, { useState } from 'react';
import { CompressorVisualisation } from './CompressorVisualisation';
import { EffectsSlider } from './EffectsSlider';
import { EQVisualisation } from './EQVisualisation';

interface EffectsPanelProps {
  label: string;
  stripId: number;
  onEffectChange: (
    filter: string,
    parameter: string,
    value: number | string
  ) => void;
}

export const EffectsPanel: React.FC<EffectsPanelProps> = ({
  label,
  onEffectChange
}) => {
  interface EQBand {
    type: string;
    freq: number;
    gain: number;
    q: number;
  }

  type EQState = {
    band0: EQBand;
    band1: EQBand;
    band2: EQBand;
    band3: EQBand;
    band4: EQBand;
  };

  const [eqState, setEqState] = useState<EQState>({
    band0: { type: 'none', freq: 1000, gain: 0, q: 0.707 },
    band1: { type: 'none', freq: 1000, gain: 0, q: 0.707 },
    band2: { type: 'none', freq: 1000, gain: 0, q: 0.707 },
    band3: { type: 'none', freq: 1000, gain: 0, q: 0.707 },
    band4: { type: 'none', freq: 1000, gain: 0, q: 0.707 }
  });

  const [compressorState, setCompressorState] = useState({
    threshold: 0,
    ratio: 4.0,
    knee: 2.5,
    makeUpGain: 0
  });

  const filterTypes = [
    'none',
    'high_pass',
    'low_shelf',
    'peak',
    'notch',
    'band_pass',
    'high_shelf',
    'low_pass'
  ];

  return (
    <div className="rounded-lg border border-dotted border-gray-600 mt-2.5 p-2 min-w-max">
      <h1 className="text-xl text-white mb-4">Settings for {label}</h1>

      <section className="mb-6">
        <h2 className="text-lg text-white mb-2">Gain</h2>
        <EffectsSlider
          id="gain_value"
          text="Gain:"
          min={-15}
          max={15}
          value={0}
          step={0.1}
          unit="dB"
          filter="gain"
          parameter="value"
          onChange={(value) => onEffectChange('gain', 'value', value)}
        />
      </section>

      {/* EQ Section */}
      <section className="mb-6">
        <h2 className="text-lg text-white mb-2">Equalizer</h2>
        {[0, 1, 2, 3, 4].map((bandIndex) => (
          <div key={bandIndex} className="mb-4">
            <h3 className="text-white mb-2">Filter {bandIndex + 1}</h3>
            <div className="mb-2">
              <label className="text-white mr-2">Type:</label>
              <select
                value={eqState[`band${bandIndex}` as keyof EQState].type}
                onChange={(e) => {
                  setEqState((prev) => ({
                    ...prev,
                    [`band${bandIndex}`]: {
                      ...prev[`band${bandIndex}` as keyof EQState],
                      type: e.target.value
                    }
                  }));
                  onEffectChange('eq', `${bandIndex} type`, e.target.value);
                }}
                className="bg-gray-700 text-white rounded px-2 py-1"
              >
                {filterTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <EffectsSlider
              id={`eq_band_${bandIndex}_freq`}
              text="Freq:"
              min={20}
              max={20000}
              value={eqState[`band${bandIndex}` as keyof EQState].freq}
              step={1}
              unit="Hz"
              filter="eq"
              parameter={`${bandIndex} freq`}
              onChange={(value) => {
                setEqState((prev) => ({
                  ...prev,
                  [`band${bandIndex}`]: {
                    ...prev[`band${bandIndex}` as keyof EQState],
                    freq: value
                  }
                }));
                onEffectChange('eq', `${bandIndex} freq`, value);
              }}
            />
          </div>
        ))}

        <EQVisualisation
          bands={eqState}
          lowPass={{ freq: 20000, q: 0.7 }}
          highPass={{ freq: 20, q: 0.7 }}
        />
      </section>

      {/* Compressor Section */}
      <section className="mb-6">
        <h2 className="text-lg text-white mb-2">Compressor</h2>
        <EffectsSlider
          id="compressor_threshold"
          text="Threshold:"
          min={-30.0}
          max={0.0}
          value={compressorState.threshold}
          step={0.05}
          unit="dB"
          filter="compressor"
          parameter="threshold"
          onChange={(value) => {
            setCompressorState((prev) => ({ ...prev, threshold: value }));
            onEffectChange('compressor', 'threshold', value);
          }}
        />

        <CompressorVisualisation
          threshold={compressorState.threshold}
          ratio={compressorState.ratio}
          kneeWidth={compressorState.knee}
          makeUpGain={compressorState.makeUpGain}
        />
      </section>
    </div>
  );
};
