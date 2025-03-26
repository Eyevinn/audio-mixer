import { useCallback, useEffect, useState } from 'react';
import { EffectsSlider } from './EffectsSlider';
import styles from './filterComponents.module.css';
import { TMidSide } from '../../../../types/types';
import Checkbox from '../../../ui/checkbox/Checkbox';

type TMidSideProps = {
  midSide: TMidSide;
  handleEffectChange: (
    filter: string,
    parameter: string,
    value: number | boolean | string
  ) => void;
};

export const MidSide = ({ midSide, handleEffectChange }: TMidSideProps) => {
  const amountValToPos = (val: number): number => Math.round(val * 100);
  const amountPosToVal = (pos: number): number => pos / 100;
  const [midAmount, setMidAmount] = useState(1.0);
  const [sideAmount, setSideAmount] = useState(1.0);

  useEffect(() => {
    setMidAmount(midSide.mid_amount);
    setSideAmount(midSide.side_amount);
  }, [midSide]);

  const onChange = useCallback(
    (filterType: string, filter: string, value: number) => {
      handleEffectChange(filterType, filter, amountPosToVal(value));
    },
    [handleEffectChange]
  );

  return (
    <section className={styles.settingsItem}>
      <h2 className="text-base font-bold mb-2">MS Stereo</h2>
      <div className="mb-2 ml-2">
        <Checkbox
          label="Enable MS Stereo"
          type="filter-settings"
          checked={midSide.enabled}
          disabled={midSide.input_format === 'ms_stereo' && midSide.enabled}
          onChange={(checked) => {
            handleEffectChange('mid_side', 'enabled', checked);
          }}
        />
        <Checkbox
          label="Invert Polarity"
          type="filter-settings"
          checked={midSide.invert_polarity}
          onChange={(checked) => {
            handleEffectChange('mid_side', 'invert_polarity', checked);
          }}
        />

        <EffectsSlider
          id="mid_amaount"
          text="Mid Amount:"
          min={0}
          max={100}
          value={amountValToPos(midAmount)}
          step={1}
          unit="%"
          filter="mid_side"
          parameter="mid_amount"
          onChange={onChange}
          // onChange={(value) => {
          //   setMidAmount(amountPosToVal(value));
          //   handleEffectChange('mid_side', 'mid_amount', amountPosToVal(value));
          // }}
        />
        <EffectsSlider
          id="side_amount"
          text="Side Amount:"
          min={0}
          max={100}
          value={amountValToPos(sideAmount)}
          step={1}
          unit="%"
          filter="mid_side"
          parameter="side_amount"
          onChange={onChange}
          // onChange={(value) => {
          //   setSideAmount(amountPosToVal(value));
          //   handleEffectChange(
          //     'mid_side',
          //     'side_amount',
          //     amountPosToVal(value)
          //   );
          // }}
        />
      </div>
    </section>
  );
};
