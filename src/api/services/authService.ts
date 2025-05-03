import axios from '../axios';
import { User } from '../../redux/slices/authSlice';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Auth service
const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>('/auth/login', credentials);
      // Store token
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sign up
  signup: async (userData: SignUpData): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>('/auth/signup', userData);
      // Store token
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await axios.post('/auth/logout');
      // Clear storage
      localStorage.removeItem('token');
    } catch (error) {
      // Still remove token even if API call fails
      localStorage.removeItem('token');
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await axios.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password request
  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      await axios.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<void> => {
    try {
      await axios.post('/auth/reset-password', { token, password });
    } catch (error) {
      throw error;
    }
  },
};

export default authService; 