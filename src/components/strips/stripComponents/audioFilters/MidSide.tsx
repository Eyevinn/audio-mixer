import { useEffect, useState } from 'react';
import { StripDropdown } from '../../../ui/dropdown/Dropdown';
import { EffectsSlider } from './EffectsSlider';
import styles from './filterComponents.module.css';
import { TMidSide } from '../../../../types/types';

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

  return (
    <section className={styles.settingsItem}>
      <h2 className="text-base font-bold mb-2">MS Stereo</h2>
      <div className="mb-2 ml-2">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="ms_stereo_swap"
            className="mr-2 h-4 w-4"
            onChange={(e) => {
              handleEffectChange(
                'mid_side',
                'invert_polarity',
                e.target.checked
              );
            }}
            checked={midSide.invert_polarity}
          />
          <label htmlFor="ms_stereo_swap" className="text-sm">
            Invert Polarity
          </label>
        </div>

        <StripDropdown
          type="Input Mode"
          options={['Left-Right', 'Mid-Side']}
          value={
            midSide.input_format === 'ms_stereo' ? 'Mid-Side' : 'Left-Right'
          }
          dropdownType="settings"
          onChange={(mode) => {
            handleEffectChange(
              'mid_side',
              'input_format',
              mode === 'mid-side' ? 'ms_stereo' : 'lr_stereo'
            );
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
          filter="mid_amaount"
          parameter="value"
          onChange={(value) => {
            setMidAmount(amountPosToVal(value));
            handleEffectChange('mid_side', 'mid_amount', amountPosToVal(value));
          }}
        />
        <EffectsSlider
          id="side_amount"
          text="Side Amount:"
          min={0}
          max={100}
          value={amountValToPos(sideAmount)}
          step={1}
          unit="%"
          filter="side_amount"
          parameter="value"
          onChange={(value) => {
            setSideAmount(amountPosToVal(value));
            handleEffectChange(
              'mid_side',
              'side_amount',
              amountPosToVal(value)
            );
          }}
        />
      </div>
    </section>
  );
};
