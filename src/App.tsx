import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import GlobalLoader from './components/ui/GlobalLoader';
import NotificationContainer from './components/ui/NotificationContainer';
import ConnectionStatus from './components/ui/ConnectionStatus';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { selectAuth } from './redux/slices/authSlice';
import { useCurrentUser, useAuthSocketEvents } from './api/hooks/useAuth';
import { showLoader, hideLoader } from './redux/slices/loadingSlice';
import './styles/global.scss';

function App() {
  // Get authentication state from Redux
  const { user } = useAppSelector(selectAuth);
  const isAuthenticated = !!user?.isAuthenticated;
  const dispatch = useAppDispatch();

  // Load user data if token exists
  const { isLoading: isLoadingUser } = useCurrentUser();
  
  // Initialize auth socket events (session expiration, etc.)
  useAuthSocketEvents();

  // Show global loader while checking auth status
  useEffect(() => {
    if (isLoadingUser && !isAuthenticated) {
      dispatch(showLoader("Loading application..."));
    } else {
      dispatch(hideLoader());
    }

    return () => {
      dispatch(hideLoader());
    };
  }, [isLoadingUser, isAuthenticated, dispatch]);

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
        {/* Global components */}
        <GlobalLoader />
        <NotificationContainer />
        <ConnectionStatus />
        
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
