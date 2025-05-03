import axios from '../axios';
import { User } from '../../redux/slices/authSlice';

// Types
export interface UserProfile extends User {
  phone?: string;
  address?: string;
  bio?: string;
  avatar?: string;
}

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// User service
const userService = {
  // Get user profile
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const response = await axios.get<UserProfile>('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    try {
      const response = await axios.put<UserProfile>('/users/profile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<void> => {
    try {
      await axios.post('/users/change-password', data);
    } catch (error) {
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post<{ avatarUrl: string }>('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user dashboard stats
  getDashboardStats: async (): Promise<any> => {
    try {
      const response = await axios.get('/users/dashboard-stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService; 