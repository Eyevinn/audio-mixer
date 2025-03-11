import { useState } from 'react';
import Icons from '../../../assets/icons/Icons';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange(newChecked);
  };

  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div
        className={`w-6 h-6 items-center justify-center border-2 rounded transition-all duration-200 ${isChecked ? 'bg-button-green border-button-green-hover' : 'bg-white border-gray-400'}`}
        onClick={handleToggle}
      >
        {isChecked && <Icons name="IconCheck" className="w-5 h-5" />}
      </div>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
};

export default Checkbox;
