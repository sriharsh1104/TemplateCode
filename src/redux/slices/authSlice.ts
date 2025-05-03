import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// User interface
export interface User {
  email: string;
  name: string;
  isAuthenticated: boolean;
  lastLogin: string;
}

// Auth state interface
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Load user from localStorage on startup if available
try {
  const userData = localStorage.getItem('user');
  if (userData) {
    initialState.user = JSON.parse(userData);
  }
} catch (error) {
  console.error('Error loading user from localStorage:', error);
}

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error message
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Login success - store user data
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    
    // Logout - clear user data
    logout: (state) => {
      state.user = null;
      state.error = null;
      // Remove from localStorage
      localStorage.removeItem('user');
    },
    
    // Update user profile
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

// Export actions
export const { setLoading, setError, loginSuccess, logout, updateProfile } = authSlice.actions;

// Export selector
export const selectAuth = (state: { auth: AuthState }) => state.auth;

// Export reducer
export default authSlice.reducer; 