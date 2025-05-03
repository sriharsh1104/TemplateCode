/**
 * Environment variable utility functions
 * This provides a consistent way to access environment variables
 * whether they're defined in import.meta.env (Vite) or window.env
 */

// Define environment interface
interface EnvVars {
  REACT_APP_API_URL: string;
  REACT_APP_SOCKET_URL: string;
  REACT_APP_TOKEN_NAME: string;
  REACT_APP_ENABLE_NOTIFICATIONS: boolean;
  REACT_APP_ENABLE_SOCKET: boolean;
  REACT_APP_MAX_UPLOAD_SIZE: number;
  REACT_APP_API_TIMEOUT: number;
  REACT_APP_SOCKET_RECONNECT_ATTEMPTS: number;
  REACT_APP_SOCKET_RECONNECT_DELAY: number;
  ENV?: string;
  [key: string]: string | number | boolean | undefined;
}

// Get the environment variables from window.env or import.meta.env
const env: EnvVars = {
  REACT_APP_API_URL: getEnvVar('REACT_APP_API_URL', 'http://localhost:5000/api'),
  REACT_APP_SOCKET_URL: getEnvVar('REACT_APP_SOCKET_URL', 'http://localhost:5000'),
  REACT_APP_TOKEN_NAME: getEnvVar('REACT_APP_TOKEN_NAME', 'token'),
  REACT_APP_ENABLE_NOTIFICATIONS: getBoolEnvVar('REACT_APP_ENABLE_NOTIFICATIONS', true),
  REACT_APP_ENABLE_SOCKET: getBoolEnvVar('REACT_APP_ENABLE_SOCKET', true),
  REACT_APP_MAX_UPLOAD_SIZE: getNumberEnvVar('REACT_APP_MAX_UPLOAD_SIZE', 5242880),
  REACT_APP_API_TIMEOUT: getNumberEnvVar('REACT_APP_API_TIMEOUT', 30000),
  REACT_APP_SOCKET_RECONNECT_ATTEMPTS: getNumberEnvVar('REACT_APP_SOCKET_RECONNECT_ATTEMPTS', 5),
  REACT_APP_SOCKET_RECONNECT_DELAY: getNumberEnvVar('REACT_APP_SOCKET_RECONNECT_DELAY', 2000),
  ENV: getEnvVar('ENV', 'development')
};

/**
 * Get a string environment variable 
 * Checks window.env, import.meta.env with different prefixes, and falls back to a default value
 */
function getEnvVar(name: string, defaultValue: string = ''): string {
  // Check window.env (our custom solution)
  if (typeof window !== 'undefined' && (window as any).env && (window as any).env[name]) {
    return (window as any).env[name];
  }
  
  // Try with VITE_ prefix (Vite's convention)
  const viteName = `VITE_${name}`;
  
  // Check import.meta.env with various prefixes
  if (typeof import.meta !== 'undefined') {
    if (import.meta.env && import.meta.env[name]) {
      return import.meta.env[name];
    }
    
    if (import.meta.env && import.meta.env[viteName]) {
      return import.meta.env[viteName];
    }
  }
  
  // Return default value
  return defaultValue;
}

/**
 * Get a boolean environment variable
 */
function getBoolEnvVar(name: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(name, String(defaultValue));
  return value === 'true' || value === '1';
}

/**
 * Get a number environment variable
 */
function getNumberEnvVar(name: string, defaultValue: number = 0): number {
  const value = getEnvVar(name, String(defaultValue));
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export default env; 