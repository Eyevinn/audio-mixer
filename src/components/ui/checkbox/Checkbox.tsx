import { useEffect, useState } from 'react';
import Icons from '../../../assets/icons/Icons';

interface CheckboxProps {
  label?: string;
  type?: 'filter-settings';
  disabled?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  type,
  checked,
  onChange,
  disabled
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleToggle = () => {
    if (disabled) return;
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange(newChecked);
  };

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <label
      className={`flex items-center space-x-2 ${disabled ? 'cursor-default' : 'cursor-pointer'} ${type === 'filter-settings' ? 'py-2' : ''}`}
    >
      <div
        className={`
          w-6 h-6 items-center justify-center border-2 rounded transition-all duration-200
          ${disabled ? 'bg-gray-400 border-gray-400' : isChecked ? 'bg-button-green border-button-green-hover' : 'bg-white border-gray-400'}
        `}
        onClick={handleToggle}
      >
        {isChecked && <Icons name="IconCheck" className="w-5 h-5" />}
      </div>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
};

export default Checkbox;
