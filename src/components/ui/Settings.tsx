import React, { useState, useRef, useEffect } from 'react';
import './Settings.scss';

// MUI Icons
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleSettings = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    
    // Dispatch auth change event to update app state
    window.dispatchEvent(new Event('auth-change'));
    
    // Navigate to sign in page
    navigate('/auth/signin');
  };

  const settingsOptions = [
    {
      id: 'account',
      label: 'Account Settings',
      icon: <AccountCircleOutlinedIcon />,
      onClick: () => navigate('/profile')
    },
    {
      id: 'security',
      label: 'Security',
      icon: <SecurityOutlinedIcon />,
      onClick: () => navigate('/settings')
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <NotificationsOutlinedIcon />,
      onClick: () => console.log('Notification settings')
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpOutlineOutlinedIcon />,
      onClick: () => console.log('Help')
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogoutOutlinedIcon />,
      onClick: handleLogout
    }
  ];

  return (
    <div className="settings-dropdown" ref={settingsRef}>
      <button className="settings-icon" onClick={toggleSettings}>
        <SettingsOutlinedIcon />
      </button>
      
      {isOpen && (
        <div className="settings-menu">
          <div className="settings-header">
            <h3>Settings</h3>
          </div>
          <div className="settings-options">
            {settingsOptions.map(option => (
              <div 
                key={option.id} 
                className="settings-option"
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
              >
                <span className="settings-option-icon">{option.icon}</span>
                <span className="settings-option-label">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 