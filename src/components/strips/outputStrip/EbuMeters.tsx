interface EbuMetersProps {
  ebu_i: number;
  ebu_m: number;
  ebu_s: number;
}

export const EbuMeters = ({ ebu_i, ebu_m, ebu_s }: EbuMetersProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-white text-xs mt-[-30px]">
      <div className="flex flex-col">
        <span>EBU R 128 M:</span>
        <span>{ebu_m ? ebu_m.toFixed(1) : '-'} LUFS</span>
      </div>
      <div className="flex flex-col">
        <span>EBU R 128 S:</span>
        <span>{ebu_s ? ebu_s.toFixed(1) : '-'} LUFS</span>
      </div>
      <div className="flex flex-col">
        <span>EBU R 128 I:</span>
        <span>{ebu_i ? ebu_i.toFixed(1) : '-'} LUFS</span>
      </div>
    </div>
  );
};
