import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__copyright">
          &copy; {currentYear} Your Company. All rights reserved.
        </p>
        <div className="footer__links">
          <a href="#" className="footer__link">
            Privacy Policy
          </a>
          <a href="#" className="footer__link">
            Terms of Service
          </a>
          <a href="#" className="footer__link">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 