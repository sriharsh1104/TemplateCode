import axios from 'axios';
import store from '../redux/store';
import { sessionExpired, logout } from '../redux/slices/authSlice';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

// Create a base axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Flag to prevent multiple token refresh calls
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue: any[] = [];

// Process failed requests queue with new token or reject all
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from redux store
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error response is 401 Unauthorized and not a retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Check if it's a refresh token endpoint
      if (originalRequest.url === '/auth/refresh-token') {
        // Refresh token failed as well, logout user
        store.dispatch(sessionExpired());
        return Promise.reject(error);
      }
      
      // Check if already refreshing
      if (isRefreshing) {
        // Add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      // Try to refresh token
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Check if we have a refresh token
        const token = store.getState().auth.token;
        if (!token) {
          throw new Error('No token available');
        }
        
        const response = await axiosInstance.post('/auth/refresh-token');
        const { token: newToken } = response.data;
        
        // Update auth header for original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Process queue with new token
        processQueue(null, newToken);
        isRefreshing = false;
        
        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        store.dispatch(sessionExpired());
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response && error.response.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Permission denied', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 