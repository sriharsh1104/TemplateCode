import { useEffect, useState } from 'react';
import socketUtils from '../utils/socket';
import env from '../utils/env';

// This component handles socket initialization and global notification listeners
const SocketManager: React.FC<{ token: string }> = ({ token }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Skip if socket functionality is disabled
    if (!env.REACT_APP_ENABLE_SOCKET) {
      return;
    }

    // Skip if no token is provided
    if (!token) {
      return;
    }

    // Initialize socket connection
    const socket = socketUtils.initializeSocket(token);

    // Set up connection status listener
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
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
      socketUtils.disconnectSocket();
    };
  }, [token]);

  // This component doesn't render anything visible
  return null;
};

export default SocketManager; 