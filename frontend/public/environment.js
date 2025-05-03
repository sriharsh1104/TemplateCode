// This file contains environment variables that will be accessible in the browser
// It's loaded before the React app in index.html

// Define window.env if it doesn't exist
window.env = window.env || {};

// Configure environment variables
Object.assign(window.env, {
  // API URLs
  REACT_APP_API_URL: 'http://localhost:5000/api',  
  REACT_APP_SOCKET_URL: 'http://localhost:5000',
  
  // Authentication
  REACT_APP_TOKEN_NAME: 'token',
  
  // Feature Flags
  REACT_APP_ENABLE_NOTIFICATIONS: true,
  REACT_APP_ENABLE_SOCKET: true,
  
  // File Upload Limits
  REACT_APP_MAX_UPLOAD_SIZE: 5242880, // 5MB
  
  // Timeouts (in milliseconds)
  REACT_APP_API_TIMEOUT: 30000,
  REACT_APP_SOCKET_RECONNECT_ATTEMPTS: 5,
  REACT_APP_SOCKET_RECONNECT_DELAY: 2000,
  
  // Misc
  ENV: 'development'
}); 