type ButtonProps = {
  status: 'SELECT' | 'PFL' | 'MUTE';
  label: string;
};

export const ActionButton = ({ status, label }: ButtonProps) => {
  const test = 'test';
  return (
    <button
      className={`relative w-[61px] h-[40px] text-[15px] border-none bg-darkgrey text-center m-[5px_10px] p-0 rounded-[5px] text-white         
        ${status === 'SELECT' ? 'bg-selectgreen' : 'bg-darkgray'}
        ${status === 'PFL' ? 'bg-pflyellow' : 'bg-darkgray'}
        ${status === 'MUTE' ? 'bg-mutered' : 'bg-darkgray'}`}
      id={label.toLowerCase()}
      data-buttonstate="0"
    >
      <b>{label}</b>
    </button>
  );
};
