import { useEffect, useState } from 'react';
import socketUtils from '../utils/socket';
import env from '../utils/env';

// This component handles socket initialization and global notification listeners
const SocketManager: React.FC<{ token: string }> = ({ token }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);

  useEffect(() => {
    // Skip if socket functionality is disabled
    if (!env.REACT_APP_ENABLE_SOCKET) {
      console.log('Socket functionality is disabled via environment variable');
      return;
    }

    // Skip if no token is provided
    if (!token) {
      console.log('No token provided for socket connection');
      return;
    }

    try {
      // Initialize socket connection
      const socket = socketUtils.initializeSocket(token);

      // Set up connection status listener
      socket.on('connect', () => {
        setIsConnected(true);
        setConnectionError(null);
        console.log('Socket connected successfully in SocketManager');
      });

      socket.on('disconnect', (reason) => {
        setIsConnected(false);
        console.log(`Socket disconnected in SocketManager: ${reason}`);
      });

      socket.on('connect_error', (error) => {
        setConnectionError(error);
        console.error('Socket connection error in SocketManager:', error);
      });

      // Set up notification listener
      socket.on('notification', (data) => {
        // Here you would dispatch to your notification system
        // For example, using a toast notification library
        console.log('Notification received:', data);
      });

      // Set up ticket update listener
      socket.on('ticket_update', (data) => {
        console.log('Ticket updated:', data);
        // Update your application state here
      });

      // Set up ticket message listener
      socket.on('ticket_message', (data) => {
        console.log('New ticket message:', data);
        // Update your application state here
      });

      // Cleanup on unmount
      return () => {
        try {
          socketUtils.disconnectSocket();
        } catch (error) {
          console.error('Error during socket disconnection:', error);
        }
      };
    } catch (error) {
      console.error('Error initializing socket in SocketManager:', error);
      setConnectionError(error instanceof Error ? error : new Error('Unknown error'));
      return () => {}; // Return empty cleanup function
    }
  }, [token]);

  // This component doesn't render anything visible
  return null;
};

export default SocketManager; 