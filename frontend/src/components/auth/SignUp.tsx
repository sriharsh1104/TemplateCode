import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useSignUp } from '../../api/hooks/useAuth';
import { useAppSelector } from '../../redux/hooks';
import { selectAuth } from '../../redux/slices/authSlice';
import Loader from '../ui/Loader';
import { useGlobalLoader } from '../../hooks/useGlobalLoader';
import './SignUp.scss';

// Validation schema
const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required')
    .min(2, 'Name is too short'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms')
    .required('You must agree to the terms')
});

// Form values interface
interface SignUpValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const SignUp: React.FC = () => {
  const signUp = useSignUp();
  const { isLoading, error } = useAppSelector(selectAuth);
  
  // Use global loader
  useGlobalLoader(isLoading, "Creating account...");
  
  // Initial form values
  const initialValues: SignUpValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  };
  
  const handleSubmit = (values: SignUpValues, actions: FormikHelpers<SignUpValues>) => {
    signUp.mutate({
      name: values.name,
      email: values.email,
      password: values.password
    });
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Fill in the details to get started</p>
        </div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="auth-form">
              {error && <div className="auth-error">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                  placeholder="Enter your full name"
                />
                <ErrorMessage name="name" component="div" className="error-text" />
              </div>
              
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
                  placeholder="Create a password"
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
                  placeholder="Confirm your password"
                />
                <ErrorMessage name="confirmPassword" component="div" className="error-text" />
              </div>
              
              <div className="form-group">
                <label className={`checkbox-label ${errors.agreeToTerms && touched.agreeToTerms ? 'has-error' : ''}`}>
                  <Field
                    type="checkbox"
                    name="agreeToTerms"
                  />
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" className="terms-link">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="terms-link">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                <ErrorMessage name="agreeToTerms" component="div" className="error-text" />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary signup-btn" 
                disabled={isLoading || isSubmitting}
              >
                Create Account
              </button>
              
              <div className="auth-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/" className="auth-link">
                    Sign In
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

export default SignUp; 