import { io, Socket } from 'socket.io-client';
import env from './env';

/**
 * Socket.IO client management
 * Handles connection, authentication, and provides access to the socket instance
 */

// Socket instance
let socket: Socket | null = null;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

/**
 * Initialize Socket.IO connection with authentication token
 * @param {string} token - JWT authentication token
 * @returns {Socket} - Socket.IO client instance
 */
export const initializeSocket = (token: string): Socket => {
  // If we already have a connected socket, return it
  if (socket && socket.connected) {
    return socket;
  }
  
  // If we've reached the maximum number of connection attempts, throw an error
  if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
    console.warn(`Maximum socket connection attempts (${MAX_CONNECTION_ATTEMPTS}) reached. Socket initialization disabled.`);
    throw new Error(`Failed to connect after ${MAX_CONNECTION_ATTEMPTS} attempts`);
  }
  
  try {
    // Disconnect existing socket if any
    if (socket) {
      socket.disconnect();
    }
    
    // Increment connection attempts counter
    connectionAttempts++;
    
    // Log connection attempt
    console.log(`Attempting to connect to socket (Attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})`);
    
    // Create socket connection with auth
    socket = io(env.REACT_APP_SOCKET_URL, {
      auth: {
        token
      },
      reconnectionAttempts: env.REACT_APP_SOCKET_RECONNECT_ATTEMPTS,
      reconnectionDelay: env.REACT_APP_SOCKET_RECONNECT_DELAY,
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      withCredentials: true,
      timeout: 10000 // 10 seconds timeout
    });
    
    // Handle connection
    socket.on('connect', () => {
      console.log('Socket connected successfully');
      // Reset connection attempts on successful connection
      connectionAttempts = 0;
    });
    
    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${reason}`);
    });
    
    // Handle errors
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    return socket;
  } catch (error) {
    console.error('Error initializing socket:', error);
    throw error;
  }
};

/**
 * Get the current socket instance
 * @returns {Socket|null} - Socket.IO client instance or null if not initialized
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = (): void => {
  try {
    if (socket) {
      socket.disconnect();
      socket = null;
      // Reset connection attempts
      connectionAttempts = 0;
    }
  } catch (error) {
    console.error('Error disconnecting socket:', error);
    // Reset socket instance and connection attempts even if there's an error
    socket = null;
    connectionAttempts = 0;
  }
};

/**
 * Reset connection attempts counter
 * This allows retrying connections after the maximum attempts have been reached
 */
export const resetConnectionAttempts = (): void => {
  connectionAttempts = 0;
};

/**
 * Join a specific room (e.g., support ticket room)
 * @param {string} room - Room name/ID to join
 */
export const joinRoom = (room: string): void => {
  if (socket && socket.connected) {
    socket.emit('join:ticket', room);
  } else {
    console.warn(`Cannot join room ${room}. Socket not connected.`);
  }
};

/**
 * Leave a specific room
 * @param {string} room - Room name/ID to leave
 */
export const leaveRoom = (room: string): void => {
  if (socket && socket.connected) {
    socket.emit('leave:ticket', room);
  } else {
    console.warn(`Cannot leave room ${room}. Socket not connected.`);
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  resetConnectionAttempts,
  joinRoom,
  leaveRoom
};
 