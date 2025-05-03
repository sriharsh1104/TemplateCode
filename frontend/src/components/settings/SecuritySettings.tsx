import React, { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import DevicesIcon from '@mui/icons-material/Devices';
import LaptopIcon from '@mui/icons-material/Laptop';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TabletIcon from '@mui/icons-material/Tablet';
import PublicIcon from '@mui/icons-material/Public';
import './SecuritySettings.scss';

interface LoginSession {
  id: string;
  device: 'desktop' | 'mobile' | 'tablet' | 'other';
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

const SecuritySettings: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [sessionFilter, setSessionFilter] = useState<'all' | 'active'>('all');
  
  // Mock login sessions
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([
    {
      id: '1',
      device: 'desktop',
      browser: 'Chrome on Windows',
      location: 'San Francisco, CA, USA',
      ip: '192.168.1.1',
      lastActive: 'Just now',
      current: true,
    },
    {
      id: '2',
      device: 'mobile',
      browser: 'Safari on iOS',
      location: 'New York, NY, USA',
      ip: '192.168.1.2',
      lastActive: '2 hours ago',
      current: false,
    },
    {
      id: '3',
      device: 'tablet',
      browser: 'Firefox on iPadOS',
      location: 'London, UK',
      ip: '192.168.1.3',
      lastActive: '3 days ago',
      current: false,
    },
  ]);
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Password validation would go here
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // API call would go here
    alert('Password updated successfully');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // In a real app, this would trigger a confirmation flow
    if (!twoFactorEnabled) {
      alert('Two-factor authentication enabled');
    } else {
      alert('Two-factor authentication disabled');
    }
  };
  
  const handleRecoveryEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecoveryEmail(e.target.value);
  };
  
  const handleRecoveryEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email
    if (!recoveryEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    // API call would go here
    alert('Recovery email updated successfully');
  };
  
  const terminateSession = (sessionId: string) => {
    setLoginSessions(prev => prev.filter(session => session.id !== sessionId));
    // API call would go here
    alert('Session terminated successfully');
  };
  
  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <LaptopIcon />;
      case 'mobile':
        return <SmartphoneIcon />;
      case 'tablet':
        return <TabletIcon />;
      default:
        return <DevicesIcon />;
    }
  };
  
  return (
    <div>
      <h1 className="settings-title">Security Settings</h1>
      <p className="settings-description">
        Manage your password, two-factor authentication, and other security settings
      </p>
      
      {/* Password Section */}
      <div className="settings-section">
        <h2 className="settings-section-title">Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="settings-form-group">
            <label htmlFor="currentPassword" className="settings-form-label">Current Password</label>
            <div className="password-input-group">
              <input 
                type="password" 
                id="currentPassword" 
                name="currentPassword" 
                className="settings-input" 
                value={passwordForm.currentPassword} 
                onChange={handlePasswordChange} 
                placeholder="Enter your current password"
                required
              />
              <div className="password-icon">
                <LockIcon fontSize="small" />
              </div>
            </div>
          </div>
          
          <div className="settings-form-group">
            <label htmlFor="newPassword" className="settings-form-label">New Password</label>
            <div className="password-input-group">
              <input 
                type="password" 
                id="newPassword" 
                name="newPassword" 
                className="settings-input" 
                value={passwordForm.newPassword} 
                onChange={handlePasswordChange} 
                placeholder="Enter your new password"
                required
              />
              <div className="password-icon">
                <LockIcon fontSize="small" />
              </div>
            </div>
            <div className="password-strength">
              {passwordForm.newPassword && (
                <div className="password-feedback">
                  <div className={`strength-bar ${passwordForm.newPassword.length > 8 ? 'strong' : 'weak'}`}></div>
                  <span className="strength-text">
                    {passwordForm.newPassword.length > 8 ? 'Strong' : 'Weak'} password
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="settings-form-group">
            <label htmlFor="confirmPassword" className="settings-form-label">Confirm New Password</label>
            <div className="password-input-group">
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                className="settings-input" 
                value={passwordForm.confirmPassword} 
                onChange={handlePasswordChange} 
                placeholder="Confirm your new password"
                required
              />
              <div className="password-icon">
                <LockIcon fontSize="small" />
              </div>
            </div>
            {passwordForm.newPassword && passwordForm.confirmPassword && 
             passwordForm.newPassword !== passwordForm.confirmPassword && (
              <div className="password-mismatch">Passwords do not match</div>
            )}
          </div>
          
          <button type="submit" className="settings-button">Update Password</button>
        </form>
      </div>
      
      {/* Two-Factor Authentication */}
      <div className="settings-section">
        <h2 className="settings-section-title">Two-Factor Authentication</h2>
        <div className="two-factor-container">
          <div className="two-factor-info">
            <div className="two-factor-icon">
              <PhoneAndroidIcon />
            </div>
            <div className="two-factor-text">
              <h3>Two-Factor Authentication (2FA)</h3>
              <p>Add an extra layer of security to your account. In addition to your password, you'll need to enter a code sent to your phone.</p>
            </div>
          </div>
          
          <div className="settings-switch">
            <input 
              type="checkbox" 
              id="twoFactorToggle" 
              checked={twoFactorEnabled} 
              onChange={toggleTwoFactor} 
            />
            <label htmlFor="twoFactorToggle">
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        </div>
        
        {twoFactorEnabled && (
          <div className="two-factor-methods">
            <div className="two-factor-method">
              <div className="two-factor-method-info">
                <h4>Authentication App</h4>
                <p>Use an authenticator app like Google Authenticator or Authy</p>
              </div>
              <button className="settings-button">Setup</button>
            </div>
            
            <div className="two-factor-method">
              <div className="two-factor-method-info">
                <h4>SMS Authentication</h4>
                <p>Receive a code via text message</p>
              </div>
              <button className="settings-button">Setup</button>
            </div>
            
            <div className="two-factor-method">
              <div className="two-factor-method-info">
                <h4>Backup Codes</h4>
                <p>Generate one-time use codes for emergencies</p>
              </div>
              <button className="settings-button">Generate</button>
            </div>
          </div>
        )}
      </div>
      
      {/* Recovery Options */}
      <div className="settings-section">
        <h2 className="settings-section-title">Recovery Options</h2>
        <form onSubmit={handleRecoveryEmailSubmit}>
          <div className="settings-form-group">
            <label htmlFor="recoveryEmail" className="settings-form-label">Recovery Email</label>
            <input 
              type="email" 
              id="recoveryEmail" 
              className="settings-input" 
              value={recoveryEmail} 
              onChange={handleRecoveryEmailChange} 
              placeholder="backup@example.com"
            />
            <p className="input-help-text">
              We'll use this email if you forget your password or need to recover your account
            </p>
          </div>
          
          <button type="submit" className="settings-button">Save Recovery Email</button>
        </form>
      </div>
      
      {/* Login Sessions */}
      <div className="settings-section">
        <h2 className="settings-section-title">Active Sessions</h2>
        <div className="sessions-header">
          <p className="settings-description">
            These are the devices currently logged into your account
          </p>
          
          <div className="sessions-filter">
            <button 
              className={`filter-button ${sessionFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSessionFilter('all')}
            >
              All Devices
            </button>
            <button 
              className={`filter-button ${sessionFilter === 'active' ? 'active' : ''}`}
              onClick={() => setSessionFilter('active')}
            >
              Active Recently
            </button>
          </div>
        </div>
        
        <div className="sessions-list">
          {loginSessions
            .filter(session => sessionFilter === 'all' || 
              (sessionFilter === 'active' && !session.lastActive.includes('days')))
            .map(session => (
              <div key={session.id} className={`session-item ${session.current ? 'current' : ''}`}>
                <div className="session-device">
                  {getDeviceIcon(session.device)}
                </div>
                
                <div className="session-details">
                  <div className="session-browser">
                    <strong>{session.browser}</strong>
                    {session.current && <span className="current-badge">Current</span>}
                  </div>
                  <div className="session-meta">
                    <div className="session-location">
                      <PublicIcon fontSize="small" />
                      <span>{session.location}</span>
                    </div>
                    <div className="session-time">Last active: {session.lastActive}</div>
                  </div>
                </div>
                
                {!session.current && (
                  <button 
                    className="settings-button secondary terminate-button"
                    onClick={() => terminateSession(session.id)}
                  >
                    Terminate
                  </button>
                )}
              </div>
            ))}
        </div>
        
        {loginSessions.length > 1 && (
          <button 
            className="settings-button terminate-all"
            onClick={() => {
              const nonCurrentSessions = loginSessions.filter(session => !session.current);
              setLoginSessions(loginSessions.filter(session => session.current));
              alert(`Terminated ${nonCurrentSessions.length} sessions`);
            }}
          >
            Terminate All Other Sessions
          </button>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings; 