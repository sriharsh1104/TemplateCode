// This file contains environment variables that will be accessible in the browser
// It's loaded before the React app in index.html

// Define window.env if it doesn't exist
window.env = window.env || {};

// Configure environment variables
Object.assign(window.env, {
  // API URLs - these would normally be injected during build or deployment
  REACT_APP_API_URL: 'https://api.example.com',  
  REACT_APP_SOCKET_URL: 'https://api.example.com',
  
  // Additional environment variables
  ENV: 'development'
}); 