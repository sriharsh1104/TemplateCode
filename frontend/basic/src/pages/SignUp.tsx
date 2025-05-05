import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerStart, registerSuccess, registerFailure } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import '../styles/auth.scss';

type UserType = 'investor' | 'institution';

const SignUp = () => {
  const [activeTab, setActiveTab] = useState<UserType>('investor');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    legalEntityName: '',
    verificationMethod: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleTabChange = (tab: UserType) => {
    setActiveTab(tab);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (activeTab === 'institution' && !formData.legalEntityName) {
      newErrors.legalEntityName = 'Legal entity name is required';
    }
    
    if (!formData.verificationMethod) {
      newErrors.verificationMethod = 'Please select a verification method';
    }
    
    if (!agreed) {
      newErrors.agreed = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(registerStart());
    
    try {
      // In a real app, you'd call your API here
      // For demo, we'll simulate a successful response after 1 second
      setTimeout(() => {
        const user = {
          id: '123',
          name: formData.name,
          email: formData.email,
          userType: activeTab,
        };
        
        dispatch(registerSuccess(user));
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      dispatch(registerFailure('Registration failed. Please try again.'));
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
          <h2 className="auth-title">Sign Up to LIBERTUM</h2>
          
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'investor' ? 'active' : ''}`}
              onClick={() => handleTabChange('investor')}
            >
              Investor
            </button>
            <button 
              className={`tab ${activeTab === 'institution' ? 'active' : ''}`}
              onClick={() => handleTabChange('institution')}
            >
              Institutions
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {activeTab === 'institution' && (
              <div className="form-group">
                <input
                  type="text"
                  name="legalEntityName"
                  placeholder="Full Legal Entity Name"
                  value={formData.legalEntityName}
                  onChange={handleChange}
                  className={errors.legalEntityName ? 'error' : ''}
                />
                {errors.legalEntityName && <p className="error-message">{errors.legalEntityName}</p>}
              </div>
            )}
            
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Legal Full Name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            
            <div className="form-group phone-input">
              <div className="country-code">
                <select>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                </select>
              </div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? 'error' : ''}
              />
              {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
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
            
            <div className="form-group">
              <div className="password-field">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <button type="button" className="toggle-password">
                  <span className="material-icons">visibility_off</span>
                </button>
              </div>
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>
            
            <div className="form-group">
              <select
                name="verificationMethod"
                value={formData.verificationMethod}
                onChange={handleChange}
                className={errors.verificationMethod ? 'error' : ''}
              >
                <option value="">Choose Verification Method</option>
                <option value="id">ID Verification</option>
                <option value="passport">Passport</option>
                <option value="license">Driver's License</option>
              </select>
              {errors.verificationMethod && <p className="error-message">{errors.verificationMethod}</p>}
            </div>
            
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                />
                <span>I have read, understood and accept the <Link to="/terms" className="text-link">Terms and conditions</Link> of Libertum</span>
              </label>
              {errors.agreed && <p className="error-message">{errors.agreed}</p>}
            </div>
            
            {error && <div className="error-message global-error">{error}</div>}
            
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          
          <p className="auth-redirect">
            Already have account? <Link to="/signin" className="text-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 