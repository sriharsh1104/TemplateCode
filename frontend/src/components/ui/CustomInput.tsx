import React, { InputHTMLAttributes, forwardRef } from 'react';
import './CustomInput.scss';

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  fullWidth?: boolean;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, error, fullWidth, className, ...props }, ref) => {
    return (
      <div className={`custom-input ${fullWidth ? 'full-width' : ''} ${className || ''}`}>
        <label className="custom-input__label">
          {label}
        </label>
        <input
          ref={ref}
          className={`custom-input__field ${error ? 'custom-input__field--error' : ''}`}
          {...props}
        />
        {error && <p className="custom-input__error">{error}</p>}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

export default CustomInput; 