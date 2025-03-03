import React from 'react';
import { MeterField } from './MeterField';

type TEbuMetersProps = {
  onResetLUFS: () => void;
  lufsData: {
    momentary: number | null;
    shortTerm: number | null;
    integrated: number | null;
  };
};

export const EbuMeters = ({ onResetLUFS, lufsData }: TEbuMetersProps) => {
  return (
    <div className="ml-2 bg-zinc-800 mr-2 rounded-lg mb-5 p-1">
      {/* M = Momentary LUFS */}
      <MeterField
        label="EBU R 128 M:"
        value={
          lufsData.momentary
            ? `${lufsData.momentary.toFixed(1)} LUFS`
            : '- LUFS'
        }
      />
      {/* S = Short-term LUFS */}
      <MeterField
        label="EBU R 128 S:"
        value={
          lufsData.shortTerm
            ? `${lufsData.shortTerm.toFixed(1)} LUFS`
            : '- LUFS'
        }
      />
      {/* I = Integrated LUFS */}
      <MeterField
        label="EBU R 128 I:"
        value={
          lufsData.integrated
            ? `${lufsData.integrated.toFixed(1)} LUFS`
            : '- LUFS'
        }
      />

      <button
        onClick={onResetLUFS}
        className="text-xl text-white bg-transparent border-none cursor-pointer"
      >
        ⟳
      </button>
    </div>
  );
};
