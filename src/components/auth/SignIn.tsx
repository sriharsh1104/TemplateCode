import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomInput from '../ui/CustomInput';
import './SignIn.scss';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear any error when user starts typing
    if (error) setError(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    // Handle sign in logic here
    console.log('Sign in with:', formData);
    
    // Simulate authentication - in a real app, you would verify credentials first
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        // Store user data in localStorage
        const userData = {
          email: formData.email,
          name: 'John Doe', // This would come from your API
          isAuthenticated: true,
          lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Force authentication state update
        window.dispatchEvent(new Event('auth-change'));
        
        // Navigate to dashboard after signing in
        setIsLoading(false);
        navigate('/auth/dashboard');
      } catch (err) {
        setIsLoading(false);
        setError('Authentication failed. Please try again.');
        console.error('Login error:', err);
      }
    }, 1000);
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          
          <CustomInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            fullWidth
          />
          
          <CustomInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            fullWidth
          />
          
          <div className="form-group form-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>
          
          <button type="submit" className="btn btn-primary signin-btn" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn; 