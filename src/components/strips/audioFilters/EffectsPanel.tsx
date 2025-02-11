import React, { useState } from 'react';
import styles from './filterComponents.module.css';
import { CompressorVisualisation } from './CompressorVisualisation';
import { EffectsSlider } from './EffectsSlider';
import { EQVisualisation } from './EQVisualisation';
import { useWebSocket } from '../../../context/WebSocketContext';

interface EffectsPanelProps {
  label: string;
  stripId: number;
}

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
  band5: EQBand;
  band6: EQBand;
  band7: EQBand;
};

export const EffectsPanel: React.FC<EffectsPanelProps> = ({
  label,
  stripId
}) => {
  const [eqState, setEqState] = useState<EQState>({
    band0: { type: 'none', freq: 1000, gain: 0, q: 0.707 },
    band1: { type: 'none', freq: 1000, gain: 0, q: 0.707 },
    band2: { type: 'none', freq: 1000, gain: 0, q: 0.707 },
    band3: { type: 'none', freq: 1000, gain: 0, q: 0.707 },
    band4: { type: 'none', freq: 1000, gain: 0, q: 0.707 },
    band5: { type: 'none', freq: 1000, gain: 0, q: 0.707 },
    band6: { type: 'none', freq: 1000, gain: 0, q: 0.707 },
    band7: { type: 'none', freq: 1000, gain: 0, q: 0.707 }
  });
  const eqBandFilters = [
    { select: '1 filter', array: [0] },
    { select: '2 filters', array: [0, 1] },
    { select: '3 filters', array: [0, 1, 2] },
    { select: '4 filters', array: [0, 1, 2, 3] },
    { select: '5 filters', array: [0, 1, 2, 3, 4] },
    { select: '6 filters', array: [0, 1, 2, 3, 4, 5] },
    { select: '7 filters', array: [0, 1, 2, 3, 4, 5, 6] }
  ];
  const [eqBandsArray, setEqBandsArray] = useState(eqBandFilters[0].array);
  const [trimValue, setTrimValue] = useState(0);

  const [compressorState, setCompressorState] = useState({
    threshold: 0,
    ratio: 4.0,
    knee: 2.5,
    makeUpGain: 0
  });
  const { sendMessage, isConnected } = useWebSocket();

  const filterTypes = [
    'none',
    'low_pass',
    'high_pass',
    'band_pass',
    'low_shelf',
    'high_shelf',
    'peak',
    'notch'
  ];

  const renderEQ = [
    {
      type: 'freq',
      unit: 'Hz',
      min: 20,
      max: 20000,
      step: 1
    },
    {
      type: 'gain',
      unit: 'dB',
      min: -15,
      max: 15,
      step: 0.1
    },
    {
      type: 'q',
      unit: '',
      min: 0.1,
      max: 20,
      step: 0.1
    }
  ];

  const handleEffectChange = (
    filter: string,
    parameter: string,
    value: number | string
  ) => {
    if (isConnected) {
      sendMessage({
        type: 'set',
        resource: `/audio/strips/${stripId}/filters/${filter}/${parameter}`,
        body: { value }
      });
    }
  };

  return (
    <div className="h-[70vh] min-w-max overflow-y-auto rounded-tl-lg rounded-bl-lg border border-r-0 border-filter-highlited-bg bg-filter-bg mt-4 p-2 text-white">
      <h1 className="text-xl font-semibold mb-4">Settings for {label}</h1>

      <section className={styles.settingsItem}>
        <h2 className="text-base font-bold mb-2">Trim</h2>
        <div className="mb-2 ml-2">
          <EffectsSlider
            id="trim_value"
            text="Trim:"
            min={-15}
            max={15}
            value={trimValue}
            step={0.1}
            unit="dB"
            filter="trim"
            parameter="value"
            onChange={(value) => {
              setTrimValue(value);
              handleEffectChange('trim', 'value', value);
            }}
          />
        </div>
      </section>

      {/* EQ Section */}
      <section className="mb-5">
        <label className="text-lg font-bold mr-10">Equalizer</label>
        <select
          value={JSON.stringify(eqBandsArray)}
          onChange={(e) => {
            const parsedArray = JSON.parse(e.target.value);
            setEqBandsArray(parsedArray.map(Number));
          }}
          className="text-sm bg-gray-700 rounded px-2 py-1"
        >
          {eqBandFilters.map((select) => (
            <option key={select.select} value={JSON.stringify(select.array)}>
              {select.select}
            </option>
          ))}
        </select>
        {eqBandsArray.map((bandIndex) => (
          <div key={bandIndex} className={`${styles.settingsItem} mt-5`}>
            <h3 className="text-base font-bold mb-2">Filter {bandIndex + 1}</h3>
            <div className="mb-2 ml-2">
              <div className="mb-2 text-sm">
                <label className="w-[150px] inline-block">Type:</label>
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
                    handleEffectChange(
                      'eq',
                      `${bandIndex} type`,
                      e.target.value
                    );
                  }}
                  className="bg-gray-700 rounded px-2 py-1"
                >
                  {filterTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              {renderEQ.map((eqType) => (
                <EffectsSlider
                  key={eqType.type}
                  id={`eq_band_${bandIndex}_${eqType.type}`}
                  text={`${eqType.type.charAt(0).toUpperCase() + eqType.type.slice(1)}:`}
                  min={eqType.min}
                  max={eqType.max}
                  value={Number(
                    eqState[`band${bandIndex}` as keyof EQState][
                      eqType.type as keyof EQBand
                    ]
                  )}
                  step={eqType.step}
                  unit={eqType.unit}
                  filter="eq"
                  parameter={`${bandIndex} ${eqType.type}`}
                  onChange={(value) => {
                    setEqState((prev) => ({
                      ...prev,
                      [`band${bandIndex}`]: {
                        ...prev[`band${bandIndex}` as keyof EQState],
                        [eqType.type as keyof EQBand]: value
                      }
                    }));
                    handleEffectChange(
                      'eq',
                      `${bandIndex} ${eqType.type}`,
                      value
                    );
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        <EQVisualisation
          bands={eqState}
          lowPass={{ freq: 20000, q: 0.7 }}
          highPass={{ freq: 20, q: 0.7 }}
        />
      </section>

      {/* Compressor Section */}
      <section className={styles.settingsItem}>
        <h2 className="text-base font-bold mb-2">Compressor</h2>
        <div className="mb-2 ml-2">
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
              handleEffectChange('compressor', 'threshold', value);
            }}
          />
        </div>

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
