import { ReactNode, ButtonHTMLAttributes } from 'react';
import '../../styles/components.scss';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={`
        btn 
        btn-${variant} 
        btn-${size} 
        ${fullWidth ? 'btn-full' : ''} 
        ${isLoading ? 'loading' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="loading-spinner">
          <span className="spinner"></span>
        </span>
      )}
      
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="btn-icon icon-left">{icon}</span>
      )}
      
      <span className="btn-text">{children}</span>
      
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="btn-icon icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button; 