/**
 * Environment variable utility functions
 * This provides a consistent way to access environment variables
 * whether they're defined in import.meta.env (Vite) or window.env
 */

// Define environment interface
interface EnvVars {
  REACT_APP_API_URL: string;
  REACT_APP_SOCKET_URL: string;
  ENV?: string;
  [key: string]: string | undefined;
}

// Get the environment variables from window.env or import.meta.env
const env: EnvVars = {
  REACT_APP_API_URL: getEnvVar('REACT_APP_API_URL', 'https://api.example.com'),
  REACT_APP_SOCKET_URL: getEnvVar('REACT_APP_SOCKET_URL', 'https://api.example.com'),
  ENV: getEnvVar('ENV', 'development')
};

/**
 * Get an environment variable 
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

export default env; 