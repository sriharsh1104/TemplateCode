import { useEffect, useRef } from 'react';
import socketService, { SocketEvent } from '../api/socketService';
import { useAppSelector } from '../redux/hooks';
import { selectAuth } from '../redux/slices/authSlice';

/**
 * A hook to use the WebSocket service in components.
 * It ensures the socket is initialized with the current auth token
 * and handles reconnection when the token changes.
 */
export const useSocket = () => {
  const { user, token } = useAppSelector(selectAuth);
  const isAuthenticated = !!user?.isAuthenticated;
  const prevTokenRef = useRef<string | null>(token);

  // Initialize socket on mount or when auth state changes
  useEffect(() => {
    // Only connect if user is authenticated
    if (isAuthenticated && token) {
      // If token changed, update it
      if (prevTokenRef.current !== token) {
        if (prevTokenRef.current) {
          // Token changed, update it
          socketService.updateToken(token);
        } else {
          // New login, initialize socket
          socketService.init(token);
        }
        prevTokenRef.current = token;
      } else if (!socketService.isSocketConnected()) {
        // Not connected, but should be
        socketService.init(token);
      }
    } else {
      // Not authenticated, disconnect
      if (socketService.isSocketConnected()) {
        socketService.disconnect();
      }
      prevTokenRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      // Do not disconnect on unmount - this would disconnect
      // when navigating between pages. Only disconnect on logout.
    };
  }, [isAuthenticated, token]);

  return {
    // Expose the socket service methods
    isConnected: socketService.isSocketConnected(),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
    emit: socketService.emit.bind(socketService),
    socketEvents: SocketEvent,
  };
};

// Hook to listen for specific socket events
export const useSocketEvent = (
  event: SocketEvent, 
  callback: (data: any) => void,
  deps: any[] = []
) => {
  useEffect(() => {
    const unsubscribe = socketService.on(event, callback);
    
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [event, callback, ...deps]);
}; 