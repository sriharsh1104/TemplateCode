import React, { useState } from 'react';
import { User } from '../../redux/slices/authSlice';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface AccountSettingsProps {
  user: User | null;
}

interface AccountForm {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  language: string;
  timezone: string;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  const [formData, setFormData] = useState<AccountForm>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    username: '',
    language: 'English',
    timezone: 'UTC+0 (GMT)',
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: false,
    github: false,
    facebook: false,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleConnectAccount = (account: 'google' | 'github' | 'facebook') => {
    setConnectedAccounts((prev) => ({ ...prev, [account]: !prev[account] }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - would call API in a real application
    console.log('Form submitted', formData);
    alert('Account settings saved!');
  };
  
  return (
    <div>
      <h1 className="settings-title">Account Settings</h1>
      <p className="settings-description">
        Manage your personal information and account preferences
      </p>
      
      <form onSubmit={handleSubmit}>
        {/* Profile Picture Section */}
        <div className="settings-section">
          <h2 className="settings-section-title">Profile Picture</h2>
          <div className="profile-image-container">
            <div className="profile-image">
              {profileImage ? (
                <img src={profileImage} alt="Profile" />
              ) : (
                <div className="profile-placeholder">
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="profile-image-overlay">
                <label htmlFor="profile-upload" className="profile-upload-label">
                  <PhotoCameraIcon />
                </label>
                <input 
                  type="file" 
                  id="profile-upload" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                />
              </div>
            </div>
            <div className="profile-image-actions">
              <button type="button" className="settings-button secondary" onClick={() => document.getElementById('profile-upload')?.click()}>
                Change Photo
              </button>
              {profileImage && (
                <button type="button" className="settings-button secondary" onClick={() => setProfileImage(null)}>
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Personal Information Section */}
        <div className="settings-section">
          <h2 className="settings-section-title">Personal Information</h2>
          
          <div className="settings-form-group">
            <label htmlFor="fullName" className="settings-form-label">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName" 
              className="settings-input" 
              value={formData.fullName} 
              onChange={handleChange} 
              placeholder="Your full name"
            />
          </div>
          
          <div className="settings-form-group">
            <label htmlFor="email" className="settings-form-label">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="settings-input" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="settings-form-group">
            <label htmlFor="phone" className="settings-form-label">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              className="settings-input" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
        
        {/* Display Preferences Section */}
        <div className="settings-section">
          <h2 className="settings-section-title">Display Preferences</h2>
          
          <div className="settings-form-group">
            <label htmlFor="username" className="settings-form-label">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className="settings-input" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="username"
            />
          </div>
          
          <div className="settings-form-group">
            <label htmlFor="language" className="settings-form-label">Language</label>
            <select 
              id="language" 
              name="language" 
              className="settings-input" 
              value={formData.language} 
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>
          
          <div className="settings-form-group">
            <label htmlFor="timezone" className="settings-form-label">Time Zone</label>
            <select 
              id="timezone" 
              name="timezone" 
              className="settings-input" 
              value={formData.timezone} 
              onChange={handleChange}
            >
              <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
              <option value="UTC-8 (PST)">UTC-8 (PST)</option>
              <option value="UTC-5 (EST)">UTC-5 (EST)</option>
              <option value="UTC+1 (CET)">UTC+1 (CET)</option>
              <option value="UTC+5:30 (IST)">UTC+5:30 (IST)</option>
              <option value="UTC+9 (JST)">UTC+9 (JST)</option>
            </select>
          </div>
        </div>
        
        {/* Connected Accounts Section */}
        <div className="settings-section">
          <h2 className="settings-section-title">Connected Accounts</h2>
          <p className="settings-description">
            Connect third-party accounts to enhance your experience
          </p>
          
          <div className="connected-accounts">
            <div className="connected-account-item">
              <div className="connected-account-info">
                <div className="connected-account-icon google">G</div>
                <div className="connected-account-details">
                  <h3>Google</h3>
                  <p>{connectedAccounts.google ? 'Connected' : 'Not connected'}</p>
                </div>
              </div>
              <button 
                type="button" 
                className={`settings-button ${connectedAccounts.google ? 'secondary' : ''}`}
                onClick={() => handleConnectAccount('google')}
              >
                {connectedAccounts.google ? (
                  <>
                    <DeleteIcon fontSize="small" style={{ marginRight: '5px' }} />
                    Disconnect
                  </>
                ) : (
                  <>
                    <AddIcon fontSize="small" style={{ marginRight: '5px' }} />
                    Connect
                  </>
                )}
              </button>
            </div>
            
            <div className="connected-account-item">
              <div className="connected-account-info">
                <div className="connected-account-icon github">GH</div>
                <div className="connected-account-details">
                  <h3>GitHub</h3>
                  <p>{connectedAccounts.github ? 'Connected' : 'Not connected'}</p>
                </div>
              </div>
              <button 
                type="button" 
                className={`settings-button ${connectedAccounts.github ? 'secondary' : ''}`}
                onClick={() => handleConnectAccount('github')}
              >
                {connectedAccounts.github ? (
                  <>
                    <DeleteIcon fontSize="small" style={{ marginRight: '5px' }} />
                    Disconnect
                  </>
                ) : (
                  <>
                    <AddIcon fontSize="small" style={{ marginRight: '5px' }} />
                    Connect
                  </>
                )}
              </button>
            </div>
            
            <div className="connected-account-item">
              <div className="connected-account-info">
                <div className="connected-account-icon facebook">FB</div>
                <div className="connected-account-details">
                  <h3>Facebook</h3>
                  <p>{connectedAccounts.facebook ? 'Connected' : 'Not connected'}</p>
                </div>
              </div>
              <button 
                type="button" 
                className={`settings-button ${connectedAccounts.facebook ? 'secondary' : ''}`}
                onClick={() => handleConnectAccount('facebook')}
              >
                {connectedAccounts.facebook ? (
                  <>
                    <DeleteIcon fontSize="small" style={{ marginRight: '5px' }} />
                    Disconnect
                  </>
                ) : (
                  <>
                    <AddIcon fontSize="small" style={{ marginRight: '5px' }} />
                    Connect
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="settings-actions">
          <button type="submit" className="settings-button">
            Save Changes
          </button>
          <button type="button" className="settings-button secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings; 