import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import '../../styles/layout.scss';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search for:', searchQuery);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="left-section">
            {isAuthenticated && (
              <button className="sidebar-toggle" onClick={toggleSidebar}>
                <span className="material-icons">menu</span>
              </button>
            )}
            <div className="logo">
              <Link to="/">
                <img src="/logo.svg" alt="PatentBrowser" />
              </Link>
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="search-bar">
              <form onSubmit={handleSearch}>
                <div className="search-input-wrapper">
                  <span className="material-icons">search</span>
                  <input 
                    type="text" 
                    placeholder="Search patents, inventors, companies..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="search-button">Search</button>
              </form>
            </div>
          )}
          
          <div className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <nav className={`main-nav ${mobileMenuOpen ? 'active' : ''}`}>
            {isAuthenticated && (
              <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/search">Advanced Search</Link></li>
                <li><Link to="/collections">Collections</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
              </ul>
            )}
          </nav>
          
          <div className="user-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="notification-icon">
                  <span className="material-icons">notifications</span>
                  <span className="notification-badge">3</span>
                </span>
                <span className="user-name">{user?.name}</span>
                <div className="dropdown-menu">
                  <Link to="/profile">Profile</Link>
                  <Link to="/settings">Settings</Link>
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/signin" className="btn btn-text">Sign In</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 