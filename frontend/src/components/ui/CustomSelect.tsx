import React, { SelectHTMLAttributes, forwardRef } from 'react';
import './CustomSelect.scss';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: Option[];
  error?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

const CustomSelect = forwardRef<HTMLSelectElement, CustomSelectProps>(
  ({ label, options, error, fullWidth, className, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={`custom-select ${fullWidth ? 'full-width' : ''} ${className || ''}`}>
        <label className="custom-select__label">
          {label}
        </label>
        <div className="custom-select__wrapper">
          <select
            ref={ref}
            className={`custom-select__field ${error ? 'custom-select__field--error' : ''}`}
            onChange={handleChange}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="custom-select__arrow"></div>
        </div>
        {error && <p className="custom-select__error">{error}</p>}
      </div>
    );
  }
);

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect; 