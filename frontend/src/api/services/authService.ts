import axios from '../axios';
import { User, AuthResponse } from '../../redux/slices/authSlice';

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

// Auth service
const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sign up
  signup: async (userData: SignUpData): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      // Proceed with local logout even if API call fails
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const response = await axios.get<AuthResponse>('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string; expiresAt?: number }> => {
    try {
      const response = await axios.post<{ token: string; expiresAt?: number }>('/auth/refresh-token');
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