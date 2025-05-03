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
import UserSettings from './components/settings/UserSettings';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { selectAuth } from './redux/slices/authSlice';
import { useCurrentUser, useAuthSocketEvents } from './api/hooks/useAuth';
import { showLoader, hideLoader } from './redux/slices/loadingSlice';
import SocketManager from './components/SocketManager';
import env from './utils/env';
import './styles/global.scss';

// Move the inner content of App into a separate component
// This allows us to use router hooks inside it
function AppContent() {
  // Get authentication state
  const { isLoading } = useCurrentUser();
  const { user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  
  // Initialize auth socket events
  useAuthSocketEvents();
  
  // Show loader when authenticating
  useEffect(() => {
    if (isLoading) {
      dispatch(showLoader('Authenticating...'));
    } else {
      dispatch(hideLoader());
    }
  }, [isLoading, dispatch]);
  
  // Get token for socket connection
  const token = localStorage.getItem(env.REACT_APP_TOKEN_NAME);
  
  // Auth Guard - Protects routes that require authentication
  const AuthGuard = () => {
    if (!user?.isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  };

  return (
    <div>
      {/* Global components */}
      <GlobalLoader />
      <NotificationContainer />
      <ConnectionStatus />
      
      {/* Socket Manager will handle all socket connections */}
      {token && user?.isAuthenticated && <SocketManager token={token} />}
      
      <Routes>
        {/* Root redirect - Sign In page */}
        <Route 
          path="/" 
          element={
            user?.isAuthenticated ? <Navigate to="/auth/dashboard" replace /> : <SignIn />
          } 
        />
        
        {/* Sign Up route */}
        <Route path="/signup" element={
          user?.isAuthenticated ? <Navigate to="/auth/dashboard" replace /> : <SignUp />
        } />
        
        {/* Other auth routes */}
        <Route path="/forgot-password" element={
          user?.isAuthenticated ? <Navigate to="/auth/dashboard" replace /> : <ForgotPassword />
        } />
        <Route path="/reset-password" element={
          user?.isAuthenticated ? <Navigate to="/auth/dashboard" replace /> : <ResetPassword />
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
                  <UserSettings />
                </Layout>
              } 
            />
          </Route>
        </Route>

        {/* Catch all - 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

// Main App component
function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
