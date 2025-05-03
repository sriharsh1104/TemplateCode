import React, { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmsIcon from '@mui/icons-material/Sms';
import './NotificationSettings.scss';

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface NotificationType {
  id: string;
  name: string;
  description: string;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

const NotificationSettings: React.FC = () => {
  // State for notification channels
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'email',
      name: 'Email Notifications',
      description: 'Receive notifications via email',
      enabled: true,
    },
    {
      id: 'push',
      name: 'Push Notifications',
      description: 'Receive notifications on your device',
      enabled: true,
    },
    {
      id: 'sms',
      name: 'SMS Notifications',
      description: 'Receive notifications via text message',
      enabled: false,
    },
  ]);
  
  // State for notification types
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([
    {
      id: 'account',
      name: 'Account Updates',
      description: 'Password changes, security alerts, and account activity',
      channels: {
        email: true,
        push: true,
        sms: true,
      },
    },
    {
      id: 'activity',
      name: 'Activity Notifications',
      description: 'Mentions, comments, and interactions with your content',
      channels: {
        email: true,
        push: true,
        sms: false,
      },
    },
    {
      id: 'updates',
      name: 'Product Updates',
      description: 'New features, improvements, and system changes',
      channels: {
        email: true,
        push: false,
        sms: false,
      },
    },
    {
      id: 'marketing',
      name: 'Marketing & Promotions',
      description: 'News, offers, and promotional content',
      channels: {
        email: false,
        push: false,
        sms: false,
      },
    },
  ]);
  
  // State for digest frequency
  const [digestFrequency, setDigestFrequency] = useState<string>('daily');
  // State for quiet hours
  const [quietHours, setQuietHours] = useState({
    enabled: false,
    start: '22:00',
    end: '07:00',
  });
  
  // Toggle channel on/off
  const toggleChannel = (channelId: string) => {
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled } 
        : channel
    ));
    
    // If a channel is disabled, also disable all notification types for that channel
    if (channels.find(c => c.id === channelId)?.enabled) {
      setNotificationTypes(notificationTypes.map(type => ({
        ...type,
        channels: {
          ...type.channels,
          [channelId]: false,
        }
      })));
    }
  };
  
  // Toggle notification type for a specific channel
  const toggleNotificationType = (typeId: string, channelId: keyof NotificationType['channels']) => {
    setNotificationTypes(notificationTypes.map(type => 
      type.id === typeId 
        ? { 
            ...type, 
            channels: { 
              ...type.channels, 
              [channelId]: !type.channels[channelId] 
            } 
          } 
        : type
    ));
  };
  
  // Handle digest frequency change
  const handleDigestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDigestFrequency(e.target.value);
  };
  
  // Toggle quiet hours
  const toggleQuietHours = () => {
    setQuietHours({ ...quietHours, enabled: !quietHours.enabled });
  };
  
  // Handle quiet hours time change
  const handleQuietHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuietHours({ ...quietHours, [name]: value });
  };
  
  // Save settings
  const handleSave = () => {
    // Here you would typically call your API to save the settings
    alert('Notification settings saved!');
  };
  
  // Get channel icon
  const getChannelIcon = (channelId: string) => {
    switch (channelId) {
      case 'email':
        return <EmailIcon />;
      case 'push':
        return <NotificationsIcon />;
      case 'sms':
        return <SmsIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <div>
      <h1 className="settings-title">Notification Settings</h1>
      <p className="settings-description">
        Manage how and when you receive notifications
      </p>
      
      {/* Notification Channels */}
      <div className="settings-section">
        <h2 className="settings-section-title">Notification Channels</h2>
        <div className="notification-channels">
          {channels.map(channel => (
            <div key={channel.id} className="notification-channel-item">
              <div className="notification-channel-info">
                <div className={`notification-channel-icon ${channel.id}`}>
                  {getChannelIcon(channel.id)}
                </div>
                <div className="notification-channel-details">
                  <h3>{channel.name}</h3>
                  <p>{channel.description}</p>
                </div>
              </div>
              
              <div className="settings-switch">
                <input
                  type="checkbox"
                  id={`channel-${channel.id}`}
                  checked={channel.enabled}
                  onChange={() => toggleChannel(channel.id)}
                />
                <label htmlFor={`channel-${channel.id}`}>
                  {channel.enabled ? 'Enabled' : 'Disabled'}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Notification Types */}
      <div className="settings-section">
        <h2 className="settings-section-title">Notification Types</h2>
        <div className="notification-types-table">
          <div className="notification-table-header">
            <div className="notification-type-cell">Notification Type</div>
            {channels.map(channel => (
              <div key={channel.id} className="notification-channel-cell">
                <div className={`channel-icon-small ${channel.id}`}>
                  {getChannelIcon(channel.id)}
                </div>
                <span>{channel.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
          
          {notificationTypes.map(type => (
            <div key={type.id} className="notification-table-row">
              <div className="notification-type-cell">
                <h3>{type.name}</h3>
                <p>{type.description}</p>
              </div>
              
              {Object.entries(type.channels).map(([channelId, isEnabled]) => {
                const channel = channels.find(c => c.id === channelId);
                return (
                  <div key={channelId} className="notification-channel-cell">
                    <div className="settings-switch">
                      <input
                        type="checkbox"
                        id={`${type.id}-${channelId}`}
                        checked={isEnabled}
                        disabled={!channel?.enabled}
                        onChange={() => toggleNotificationType(type.id, channelId as keyof NotificationType['channels'])}
                      />
                      <label htmlFor={`${type.id}-${channelId}`}></label>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Notification Preferences */}
      <div className="settings-section">
        <h2 className="settings-section-title">Notification Preferences</h2>
        
        <div className="settings-form-group">
          <label htmlFor="digestFrequency" className="settings-form-label">Email Digest Frequency</label>
          <select 
            id="digestFrequency" 
            className="settings-input" 
            value={digestFrequency} 
            onChange={handleDigestChange}
          >
            <option value="instant">Instant (as they happen)</option>
            <option value="daily">Daily Summary</option>
            <option value="weekly">Weekly Summary</option>
            <option value="never">Never</option>
          </select>
          <p className="input-help-text">
            Choose how often you want to receive email notifications
          </p>
        </div>
        
        <div className="quiet-hours-container">
          <div className="quiet-hours-header">
            <h3>Quiet Hours</h3>
            <div className="settings-switch">
              <input
                type="checkbox"
                id="quietHoursToggle"
                checked={quietHours.enabled}
                onChange={toggleQuietHours}
              />
              <label htmlFor="quietHoursToggle">
                {quietHours.enabled ? 'Enabled' : 'Disabled'}
              </label>
            </div>
          </div>
          
          <p className="quiet-hours-description">
            During quiet hours, you won't receive push or SMS notifications
          </p>
          
          {quietHours.enabled && (
            <div className="quiet-hours-times">
              <div className="time-input-group">
                <label htmlFor="start">Start Time</label>
                <input
                  type="time"
                  id="start"
                  name="start"
                  className="settings-input"
                  value={quietHours.start}
                  onChange={handleQuietHoursChange}
                />
              </div>
              
              <div className="time-input-group">
                <label htmlFor="end">End Time</label>
                <input
                  type="time"
                  id="end"
                  name="end"
                  className="settings-input"
                  value={quietHours.end}
                  onChange={handleQuietHoursChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="settings-button" onClick={handleSave}>
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings; 