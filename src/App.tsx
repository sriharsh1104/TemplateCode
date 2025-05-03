import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useState, useEffect, ReactNode } from 'react';
import Layout from './components/layout/Layout';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './styles/global.scss';

function App() {
  // Get authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check user auth state
  const checkAuthStatus = () => {
    try {
      const user = localStorage.getItem('user');
      const userData = user ? JSON.parse(user) : null;
      
      if (userData && userData.isAuthenticated) {
        setIsAuthenticated(true);
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    // Custom event for auth changes within the app
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    // Storage events only fire in other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        checkAuthStatus();
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Auth Guard - Protects routes that require authentication
  const AuthGuard = () => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Root redirect - Sign In page */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/auth/dashboard" replace /> : <SignIn />
            } 
          />
          
          {/* Sign Up route */}
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/auth/dashboard" replace /> : <SignUp />
          } />
          
          {/* Other auth routes */}
          <Route path="/forgot-password" element={
            isAuthenticated ? <Navigate to="/auth/dashboard" replace /> : <ForgotPassword />
          } />
          <Route path="/reset-password" element={
            isAuthenticated ? <Navigate to="/auth/dashboard" replace /> : <ResetPassword />
          } />
          
          {/* Protected routes - wrapped in AuthGuard */}
          <Route element={<AuthGuard />}>
            <Route path="/auth" element={<Outlet />}>
              <Route 
                path="dashboard" 
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <Layout>
                    <Profile />
                  </Layout>
                } 
              />
              <Route 
                path="settings" 
                element={
                  <Layout>
                    <div className="settings-page">
                      <h1>Settings</h1>
                      <p>This is the settings page. Content will be added soon.</p>
                    </div>
                  </Layout>
                } 
              />
            </Route>
          </Route>

          {/* Catch all - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
