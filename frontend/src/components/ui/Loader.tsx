import React from 'react';
import './Loader.scss';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  fullPage?: boolean;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  color = 'primary',
  fullPage = false,
  text
}) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className={`loader loader-${size} loader-${color}`}>
        <div className="loader-spinner"></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader; 