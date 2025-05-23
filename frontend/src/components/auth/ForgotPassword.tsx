import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRequestPasswordReset } from '../../api/hooks/useAuth';
import { useGlobalLoader } from '../../hooks/useGlobalLoader';
import './ForgotPassword.scss';

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

// Form values interface
interface ForgotPasswordValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const resetPasswordRequest = useRequestPasswordReset();
  
  // Use global loader
  useGlobalLoader(resetPasswordRequest.isPending, "Sending reset link...");
  
  // Initial form values
  const initialValues: ForgotPasswordValues = {
    email: ''
  };
  
  const handleSubmit = (values: ForgotPasswordValues) => {
    resetPasswordRequest.mutate(values.email, {
      onSuccess: () => {
        setSentEmail(values.email);
        setEmailSent(true);
      }
    });
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h1>Forgot Password</h1>
          <p>Enter your email to reset your password</p>
        </div>
        
        {!emailSent ? (
          <Formik
            initialValues={initialValues}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="auth-form">
                {resetPasswordRequest.error && (
                  <div className="auth-error">
                    {(resetPasswordRequest.error as any)?.response?.data?.message || 'Failed to send reset link. Please try again.'}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="error-text" />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary reset-btn"
                  disabled={resetPasswordRequest.isPending || isSubmitting}
                >
                  Send Reset Link
                </button>
                
                <div className="auth-footer">
                  <p>
                    Remember your password?{' '}
                    <Link to="/" className="auth-link">
                      Sign In
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="success-message">
            <p>
              If an account exists with the email <strong>{sentEmail}</strong>, you will receive
              a password reset link shortly.
            </p>
            <p>Please check your email and follow the instructions.</p>
            
            <Link to="/" className="btn btn-primary back-btn">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 