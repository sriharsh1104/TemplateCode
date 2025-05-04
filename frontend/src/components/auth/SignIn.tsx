import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useLogin } from '../../api/hooks/useAuth';
import { useAppSelector } from '../../redux/hooks';
import { selectAuth } from '../../redux/slices/authSlice';
import Loader from '../ui/Loader';
import { useGlobalLoader } from '../../hooks/useGlobalLoader';
import './SignIn.scss';

// Validation schema
const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: Yup.boolean()
});

// Form values interface
interface SignInValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignIn: React.FC = () => {
  const login = useLogin();
  const { isLoading, error } = useAppSelector(selectAuth);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Use global loader
  useGlobalLoader(isLoading, "Signing in...");
  
  // Check if there's a success message from registration
  useEffect(() => {
    if (location.state && 'registrationSuccess' in location.state) {
      setSuccessMessage(location.state.message || 'Registration successful! Please sign in.');
      
      // Clear the location state after reading it
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  // Initial form values
  const initialValues: SignInValues = {
    email: '',
    password: '',
    rememberMe: false
  };
  
  const handleSubmit = (values: SignInValues, actions: FormikHelpers<SignInValues>) => {
    setSuccessMessage(null); // Clear success message on submit
    login.mutate({
      email: values.email,
      password: values.password
    });
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={SignInSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="auth-form">
              {error && <div className="auth-error">{error}</div>}
              {successMessage && <div className="auth-success">{successMessage}</div>}
              
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
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="error-text" />
              </div>
              
              <div className="form-group form-checkbox">
                <label className="checkbox-label">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary signin-btn" 
                disabled={isLoading || isSubmitting}
              >
                Sign In
              </button>
              
              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup" className="auth-link">
                    Sign Up
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn; 