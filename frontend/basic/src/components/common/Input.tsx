import { useState, InputHTMLAttributes, forwardRef } from 'react';
import '../../styles/components.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightIconAction?: () => void;
  fullWidth?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      leftIcon,
      rightIcon,
      rightIconAction,
      fullWidth = false,
      className = '',
      type = 'text',
      disabled,
      required,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    
    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={`input-container ${fullWidth ? 'full-width' : ''} ${className}`}>
        {label && (
          <label className="input-label">
            {label}
            {required && <span className="required-asterisk">*</span>}
          </label>
        )}
        
        <div className={`input-wrapper ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
          {leftIcon && <span className="input-icon left-icon">{leftIcon}</span>}
          
          <input
            ref={ref}
            type={isPasswordType ? (showPassword ? 'text' : 'password') : type}
            className={`input-field ${leftIcon ? 'has-left-icon' : ''} ${rightIcon || isPasswordType ? 'has-right-icon' : ''}`}
            disabled={disabled}
            required={required}
            {...rest}
          />
          
          {isPasswordType && (
            <button
              type="button"
              className="password-toggle"
              onClick={handleTogglePassword}
              tabIndex={-1}
            >
              <span className="material-icons">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          )}
          
          {rightIcon && !isPasswordType && (
            <span 
              className={`input-icon right-icon ${rightIconAction ? 'clickable' : ''}`}
              onClick={rightIconAction}
            >
              {rightIcon}
            </span>
          )}
        </div>
        
        {(error || helper) && (
          <div className={`input-message ${error ? 'error-message' : 'helper-message'}`}>
            {error || helper}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 