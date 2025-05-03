import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './ResetPassword.scss';

// Validation schema
const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match')
});

// Form values interface
interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [resetComplete, setResetComplete] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  // Initial form values
  const initialValues: ResetPasswordValues = {
    password: '',
    confirmPassword: ''
  };
  
  const handleSubmit = (values: ResetPasswordValues) => {
    // Clear any previous errors
    setServerError(null);
    
    // In a real app, you would call an API to reset the password
    console.log('Resetting password with:', values);
    
    // Simulate success
    setResetComplete(true);
    
    // Redirect to sign in after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Create a new password for your account</p>
        </div>
        
        {!resetComplete ? (
          <Formik
            initialValues={initialValues}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="auth-form">
                {serverError && <div className="auth-error">{serverError}</div>}
                
                <div className="form-group">
                  <label htmlFor="password" className="form-label">New Password</label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                    placeholder="Enter new password"
                  />
                  <ErrorMessage name="password" component="div" className="error-text" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Confirm new password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="error-text" />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary reset-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
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
              Your password has been successfully reset!
            </p>
            <p>Redirecting you to the login page...</p>
            
            <Link to="/" className="btn btn-primary back-btn">
              Sign In Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 