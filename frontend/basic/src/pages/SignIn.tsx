import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import '../styles/auth.scss';

const SignIn = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(loginStart());
    
    try {
      // In a real app, you'd call your API here
      // For demo, we'll simulate a successful response after 1 second
      setTimeout(() => {
        const user = {
          id: '123',
          name: 'John Doe',
          email: formData.emailOrPhone,
          userType: 'investor' as const,
        };
        
        dispatch(loginSuccess(user));
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      dispatch(loginFailure('Invalid email/phone or password'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="brand">
          <img src="/logo.svg" alt="LIBERTUM" className="logo" />
          <h1 className="slogan">
            <span>Unlocking</span> 
            <span className="highlight">Real-World</span> 
            <span className="highlight">Opportunities</span>
            <span>through Tokenization</span>
          </h1>
        </div>
        <div className="powered-by">
          <p>Powered by</p>
          <img src="/logo.svg" alt="LIBERTUM" className="logo-sm" />
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Sign In to LIBERTUM</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="emailOrPhone"
                placeholder="Email Or Phone Number"
                value={formData.emailOrPhone}
                onChange={handleChange}
                className={errors.emailOrPhone ? 'error' : ''}
              />
              {errors.emailOrPhone && <p className="error-message">{errors.emailOrPhone}</p>}
            </div>
            
            <div className="form-group">
              <div className="password-field">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                <button type="button" className="toggle-password">
                  <span className="material-icons">visibility_off</span>
                </button>
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            
            <div className="forgot-password">
              <Link to="/forgot-password" className="text-link">Forgot Password</Link>
            </div>
            
            {error && <div className="error-message global-error">{error}</div>}
            
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <p className="auth-redirect">
            Don't have an account? <Link to="/signup" className="text-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 