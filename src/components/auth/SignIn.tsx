import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginSuccess, setError, setLoading, selectAuth } from '../../redux/slices/authSlice';
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(selectAuth);
  
  // Initial form values
  const initialValues: SignInValues = {
    email: '',
    password: '',
    rememberMe: false
  };
  
  const handleSubmit = (values: SignInValues, actions: FormikHelpers<SignInValues>) => {
    // Clear any previous errors
    dispatch(setError(null));
    dispatch(setLoading(true));
    
    // Handle sign in logic here
    console.log('Sign in with:', values);
    
    // Simulate authentication - in a real app, you would verify credentials first
    setTimeout(() => {
      try {
        // Create user data and dispatch login success
        const userData = {
          email: values.email,
          name: 'John Doe', // This would come from your API
          isAuthenticated: true,
          lastLogin: new Date().toISOString()
        };
        
        dispatch(loginSuccess(userData));
        
        // Navigate to dashboard after signing in
        navigate('/auth/dashboard');
      } catch (err) {
        dispatch(setLoading(false));
        dispatch(setError('Authentication failed. Please try again.'));
        console.error('Login error:', err);
        actions.setSubmitting(false);
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
        
        <Formik
          initialValues={initialValues}
          validationSchema={SignInSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="auth-form">
              {error && <div className="auth-error">{error}</div>}
              
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn; 