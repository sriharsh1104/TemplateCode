import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomInput from '../ui/CustomInput';
import './ResetPassword.scss';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetComplete, setResetComplete] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'New password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // In a real app, you would call an API to reset the password
      console.log('Resetting password with:', formData);
      
      // Simulate success
      setResetComplete(true);
      
      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Create a new password for your account</p>
        </div>
        
        {!resetComplete ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <CustomInput
              label="New Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              error={errors.password}
              fullWidth
            />
            
            <CustomInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              error={errors.confirmPassword}
              fullWidth
            />
            
            <button type="submit" className="btn btn-primary reset-btn">
              Reset Password
            </button>
            
            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link to="/" className="auth-link">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <div className="success-message">
            <p>
              Your password has been successfully reset!
            </p>
            <p>Redirecting you to the login page...</p>
            
            <Link to="/signin" className="btn btn-primary back-btn">
              Sign In Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 