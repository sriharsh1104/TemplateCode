import { io, Socket } from 'socket.io-client';
import env from './env';

/**
 * Socket.IO client management
 * Handles connection, authentication, and provides access to the socket instance
 */

// Socket instance
let socket: Socket | null = null;

/**
 * Initialize Socket.IO connection with authentication token
 * @param {string} token - JWT authentication token
 * @returns {Socket} - Socket.IO client instance
 */
export const initializeSocket = (token: string): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  // Create socket connection with auth
  socket = io(env.REACT_APP_SOCKET_URL, {
    auth: {
      token
    },
    reconnectionAttempts: env.REACT_APP_SOCKET_RECONNECT_ATTEMPTS,
    reconnectionDelay: env.REACT_APP_SOCKET_RECONNECT_DELAY,
    withCredentials: true
  });

  // Handle connection
  socket.on('connect', () => {
    console.log('Socket connected');
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
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Join a specific room (e.g., support ticket room)
 * @param {string} room - Room name/ID to join
 */
export const joinRoom = (room: string): void => {
  if (socket && socket.connected) {
    socket.emit('join:ticket', room);
  }
};

/**
 * Leave a specific room
 * @param {string} room - Room name/ID to leave
 */
export const leaveRoom = (room: string): void => {
  if (socket && socket.connected) {
    socket.emit('leave:ticket', room);
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  joinRoom,
  leaveRoom
};
 