import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

// Pages
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

// Authentication route - redirects to dashboard if already authenticated
const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/signup" element={
          <AuthRoute>
            <SignUp />
          </AuthRoute>
        } />
        <Route path="/signin" element={
          <AuthRoute>
            <SignIn />
          </AuthRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
