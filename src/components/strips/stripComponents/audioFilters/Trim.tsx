import { useState, useEffect } from 'react';
import { EffectsSlider } from './EffectsSlider';
import styles from './filterComponents.module.css';
import { TAudioStrip, TMixStrip } from '../../../../types/types';

type TTrimProps = {
  strip: TAudioStrip | TMixStrip;
  handleEffectChange: (
    filter: string,
    parameter: string,
    value: number
  ) => void;
};

export const Trim = ({ strip, handleEffectChange }: TTrimProps) => {
  const [trimValue, setTrimValue] = useState(0);

  useEffect(() => {
    setTrimValue(strip?.filters?.gain.value || 0);
  }, [strip]);

  return (
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
            handleEffectChange('gain', 'value', value);
          }}
        />
      </div>
    </section>
  );
};
