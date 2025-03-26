import { EffectsSlider } from './EffectsSlider';
import styles from './filterComponents.module.css';
import { TAudioStrip, TMixStrip } from '../../../../types/types';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

type TTrimProps = {
  strip: TAudioStrip | TMixStrip;
  handleEffectChange: (
    filter: string,
    parameter: string,
    value: number
  ) => void;
};

export const Trim = ({ strip, handleEffectChange }: TTrimProps) => {
  const [trimValue, setTrimValue] = useState<number>(
    strip?.filters?.gain.value || 0
  );

  useEffect(() => {
    setTrimValue(strip?.filters?.gain.value || 0);
  }, [strip?.filters?.gain.value]);

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
          step={1}
          unit="dB"
          filter="gain"
          parameter="value"
          onChange={handleEffectChange}
        />
      </div>
    </section>
  );
};
