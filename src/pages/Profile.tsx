import React, { useState } from 'react';
import CustomInput from '../components/ui/CustomInput';
import './Profile.scss';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, Country',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies ultricies, nunc nisl ultricies nunc, eget ultricies.'
  });
  
  const [formData, setFormData] = useState({ ...profileData });
  
  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...profileData });
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...profileData });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...formData });
    setIsEditing(false);
  };
  
  return (
    <div className="profile">
      <div className="profile__header">
        <h1 className="profile__title">Profile</h1>
        <p className="profile__subtitle">Manage your personal information</p>
      </div>
      
      <div className="profile__content">
        <div className="profile__sidebar">
          <div className="profile__avatar-container">
            <div className="profile__avatar">
              {profileData.fullName.split(' ').map(name => name[0]).join('')}
            </div>
            {!isEditing && (
              <button className="profile__avatar-edit">
                Edit
              </button>
            )}
          </div>
          
          <div className="profile__info">
            <h2 className="profile__name">{profileData.fullName}</h2>
            <p className="profile__email">{profileData.email}</p>
          </div>
          
          {!isEditing && (
            <button 
              className="btn btn-primary profile__edit-btn"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          )}
        </div>
        
        <div className="profile__main">
          <div className="card">
            {isEditing ? (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="profile-form__group">
                  <h3 className="profile-form__section-title">Personal Information</h3>
                  
                  <div className="profile-form__fields">
                    <CustomInput
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      fullWidth
                    />
                    
                    <CustomInput
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      disabled
                      fullWidth
                    />
                    
                    <CustomInput
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      fullWidth
                    />
                    
                    <CustomInput
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      fullWidth
                    />
                    
                    <div className="form-control">
                      <label className="form-label">Bio</label>
                      <textarea
                        className="form-textarea"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        rows={4}
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="profile-form__actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="profile-details__section">
                  <h3 className="profile-details__section-title">Personal Information</h3>
                  
                  <div className="profile-details__items">
                    <div className="profile-details__item">
                      <span className="profile-details__label">Full Name</span>
                      <span className="profile-details__value">{profileData.fullName}</span>
                    </div>
                    
                    <div className="profile-details__item">
                      <span className="profile-details__label">Email</span>
                      <span className="profile-details__value">{profileData.email}</span>
                    </div>
                    
                    <div className="profile-details__item">
                      <span className="profile-details__label">Phone</span>
                      <span className="profile-details__value">{profileData.phone}</span>
                    </div>
                    
                    <div className="profile-details__item">
                      <span className="profile-details__label">Address</span>
                      <span className="profile-details__value">{profileData.address}</span>
                    </div>
                    
                    <div className="profile-details__item">
                      <span className="profile-details__label">Bio</span>
                      <p className="profile-details__value">{profileData.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 