type TMeterFieldProps = {
  label: string;
  value: string;
};

export const MeterField = ({ label, value }: TMeterFieldProps) => {
  return (
    <>
      <p className="text-xs text-white m-0">{label}</p>
      <p className="text-xs mb-3.5 text-white">{value}</p>
    </>
  );
};
