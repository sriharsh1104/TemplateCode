import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// User interface
export interface User {
  id?: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
  lastLogin: string;
}

// Auth response interface
export interface AuthResponse {
  user: User;
  token: string;
  expiresAt?: number;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: number | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  expiresAt: null,
  isLoading: false,
  error: null,
};

// Load user from localStorage on startup if available
try {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('expiresAt');
  
  if (userData) {
    initialState.user = JSON.parse(userData);
  }
  
  if (token) {
    initialState.token = token;
  }
  
  if (expiresAt) {
    initialState.expiresAt = parseInt(expiresAt, 10);
    
    // Check if token is expired
    if (initialState.expiresAt < Date.now()) {
      // Token expired, clear state
      initialState.user = null;
      initialState.token = null;
      initialState.expiresAt = null;
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
    }
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
    
    // Login success - store user data and token
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt || null;
      state.isLoading = false;
      state.error = null;
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      
      if (action.payload.expiresAt) {
        localStorage.setItem('expiresAt', action.payload.expiresAt.toString());
      }
    },
    
    // Refresh token
    refreshToken: (state, action: PayloadAction<{ token: string; expiresAt?: number }>) => {
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt || null;
      
      // Update localStorage
      localStorage.setItem('token', action.payload.token);
      
      if (action.payload.expiresAt) {
        localStorage.setItem('expiresAt', action.payload.expiresAt.toString());
      }
    },
    
    // Session expired - clear token but keep user data
    sessionExpired: (state) => {
      state.token = null;
      state.expiresAt = null;
      if (state.user) {
        state.user.isAuthenticated = false;
      }
      
      // Update localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      if (state.user) {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    
    // Logout - clear user data and token
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.expiresAt = null;
      state.error = null;
      
      // Remove from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
    },
    
    // Force logout (e.g., from another device)
    forceLogout: (state, action: PayloadAction<string | null>) => {
      state.user = null;
      state.token = null;
      state.expiresAt = null;
      state.error = action.payload;
      
      // Remove from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
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
export const { 
  setLoading, 
  setError, 
  loginSuccess, 
  refreshToken,
  sessionExpired,
  logout, 
  forceLogout,
  updateProfile 
} = authSlice.actions;

// Export selector
export const selectAuth = (state: RootState) => state.auth;

// Export reducer
export default authSlice.reducer; 