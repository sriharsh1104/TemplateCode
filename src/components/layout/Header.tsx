import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Settings from '../ui/Settings';
import './Header.scss';

// MUI Icons
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        <Link to="/" className="header__logo">
          <h1>AppName</h1>
        </Link>
      </div>
      <div className="header__right">
        <button className="header__theme-toggle" onClick={toggleTheme}>
          {darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </button>
        <button className="header__icon-btn">
          <NotificationsNoneOutlinedIcon />
        </button>
        <Settings />
        <Link to="/profile" className="header__profile">
          <PersonOutlineOutlinedIcon />
          <span>Profile</span>
        </Link>
      </div>
    </header>
  );
};

export default Header; 