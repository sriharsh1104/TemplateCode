import React from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { selectAuth } from '../../redux/slices/authSlice';
import { selectActiveSettingsTab, setActiveSettingsTab } from '../../redux/slices/uiSettingsSlice';
import AccountSettings from './AccountSettings';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';
import HelpSupport from './HelpSupport';
import './UserSettings.scss';

// MUI Icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

type SettingsTab = 'account' | 'security' | 'notifications' | 'help';

const UserSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveSettingsTab);
  const { user } = useAppSelector(selectAuth);

  const handleTabChange = (tab: SettingsTab) => {
    dispatch(setActiveSettingsTab(tab));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings user={user} />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'help':
        return <HelpSupport />;
      default:
        return <AccountSettings user={user} />;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <h2 className="settings-heading">Settings</h2>
        <div className="settings-tabs">
          <button 
            className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => handleTabChange('account')}
          >
            <PersonOutlineIcon />
            <span>Account</span>
          </button>
          
          <button 
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => handleTabChange('security')}
          >
            <SecurityIcon />
            <span>Security</span>
          </button>
          
          <button 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => handleTabChange('notifications')}
          >
            <NotificationsIcon />
            <span>Notifications</span>
          </button>
          
          <button 
            className={`settings-tab ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => handleTabChange('help')}
          >
            <HelpOutlineIcon />
            <span>Help & Support</span>
          </button>
        </div>
      </div>
      
      <div className="settings-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UserSettings; 