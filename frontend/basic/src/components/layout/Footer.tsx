import { Link } from 'react-router-dom';
import '../../styles/layout.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/logo.svg" alt="LIBERTUM" />
            </Link>
            <p className="tagline">Unlocking Real-World Opportunities through Tokenization</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/team">Team</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            
            <div className="link-group">
              <h4>Products</h4>
              <ul>
                <li><Link to="/markets">Markets</Link></li>
                <li><Link to="/tokenization">Tokenization</Link></li>
                <li><Link to="/investing">Investing</Link></li>
                <li><Link to="/for-institutions">For Institutions</Link></li>
              </ul>
            </div>
            
            <div className="link-group">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/support">Support</Link></li>
                <li><Link to="/documentation">Documentation</Link></li>
              </ul>
            </div>
            
            <div className="link-group">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/cookies">Cookie Policy</Link></li>
                <li><Link to="/compliance">Compliance</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} LIBERTUM. All rights reserved.
          </div>
          <div className="social-links">
            <a href="https://twitter.com/libertum" target="_blank" rel="noopener noreferrer">
              <span className="material-icons">twitter</span>
            </a>
            <a href="https://linkedin.com/company/libertum" target="_blank" rel="noopener noreferrer">
              <span className="material-icons">linkedin</span>
            </a>
            <a href="https://facebook.com/libertum" target="_blank" rel="noopener noreferrer">
              <span className="material-icons">facebook</span>
            </a>
            <a href="https://instagram.com/libertum" target="_blank" rel="noopener noreferrer">
              <span className="material-icons">instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 