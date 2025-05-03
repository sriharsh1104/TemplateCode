import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomInput from '../ui/CustomInput';
import './ForgotPassword.scss';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // In a real app, you would call an API to send a password reset email
    console.log('Sending password reset email to:', email);
    
    // Simulate success
    setEmailSent(true);
    setError('');
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h1>Forgot Password</h1>
          <p>Enter your email to reset your password</p>
        </div>
        
        {!emailSent ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <CustomInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Enter your email"
              error={error}
              fullWidth
            />
            
            <button type="submit" className="btn btn-primary reset-btn">
              Send Reset Link
            </button>
            
            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link to="/signin" className="auth-link">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <div className="success-message">
            <p>
              If an account exists with the email <strong>{email}</strong>, you will receive
              a password reset link shortly.
            </p>
            <p>Please check your email and follow the instructions.</p>
            
            <Link to="/signin" className="btn btn-primary back-btn">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 