import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { setActiveSettingsTab } from '../../redux/slices/uiSettingsSlice';
import { useLogout } from '../../api/hooks/useAuth';
import './Header.scss';

// MUI Icons
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { darkMode, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const logout = useLogout();

  const handleSettingsClick = () => {
    dispatch(setActiveSettingsTab('account'));
    navigate('/auth/settings');
  };

  const handleLogout = () => {
    logout.mutate();
  };

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
        <button onClick={handleSettingsClick} className="header__icon-btn" title="Settings">
          <SettingsOutlinedIcon />
        </button>
        <button onClick={handleLogout} className="header__icon-btn" title="Logout">
          <LogoutOutlinedIcon />
        </button>
      </div>
    </header>
  );
};

export default Header; 