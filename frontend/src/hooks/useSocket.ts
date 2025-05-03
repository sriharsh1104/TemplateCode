import { useEffect, useState, useCallback } from 'react';
import socketUtils from '../utils/socket';
import socketService, { SocketEvent } from '../api/socketService';
import { Socket } from 'socket.io-client';
import { useAppSelector } from '../redux/hooks';
import { selectAuth } from '../redux/slices/authSlice';

interface UseSocketOptions {
  events?: {
    [eventName: string]: (data: any) => void;
  };
  enabled?: boolean;
  useNewImplementation?: boolean;
}

/**
 * Custom hook for socket.io functionality
 * This hook supports both the new implementation (socketUtils) and the legacy implementation (socketService)
 * @param options Configuration options
 * @returns Socket utilities and connection state
 */
export const useSocket = (options: UseSocketOptions = {}) => {
  const { events = {}, enabled = true, useNewImplementation = false } = options;
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, token } = useAppSelector(selectAuth);
  const isAuthenticated = user?.isAuthenticated;

  // For the new implementation
  useEffect(() => {
    if (!enabled || !useNewImplementation) return;
    
    const currentSocket = socketUtils.getSocket();
    if (currentSocket) {
      setSocket(currentSocket);
      setIsConnected(currentSocket.connected);
      
      // Set up connection listeners
      const onConnect = () => setIsConnected(true);
      const onDisconnect = () => setIsConnected(false);
      
      currentSocket.on('connect', onConnect);
      currentSocket.on('disconnect', onDisconnect);
      
      return () => {
        currentSocket.off('connect', onConnect);
        currentSocket.off('disconnect', onDisconnect);
      };
    }
  }, [enabled, useNewImplementation]);
  
  // For the new implementation
  useEffect(() => {
    if (!socket || !enabled || !useNewImplementation) return;
    
    // Register all event listeners
    const eventNames = Object.keys(events);
    
    eventNames.forEach(eventName => {
      socket.on(eventName, events[eventName]);
    });
    
    // Clean up event listeners on unmount or when events change
    return () => {
      eventNames.forEach(eventName => {
        socket.off(eventName, events[eventName]);
      });
    };
  }, [socket, events, enabled, useNewImplementation]);

  // For the legacy implementation - initialize socket
  useEffect(() => {
    if (!enabled || useNewImplementation) return;

    // Initialize socket connection if authenticated
    if (isAuthenticated && token) {
      if (!socketService.isSocketConnected()) {
        socketService.init(token);
      }
    } else {
      // Disconnect if not authenticated
      if (socketService.isSocketConnected()) {
        socketService.disconnect();
      }
    }

    // Set initial connection state
    setIsConnected(socketService.isSocketConnected());

    // Set up connection listener to update state
    const connectListener = () => setIsConnected(true);
    const disconnectListener = () => setIsConnected(false);

    const connectUnsubscribe = socketService.on(SocketEvent.CONNECT, connectListener);
    const disconnectUnsubscribe = socketService.on(SocketEvent.DISCONNECT, disconnectListener);

    return () => {
      connectUnsubscribe();
      disconnectUnsubscribe();
    };
  }, [isAuthenticated, token, enabled, useNewImplementation]);

  // For the legacy implementation - event listeners
  useEffect(() => {
    if (!enabled || useNewImplementation) return;
    
    const unsubscribes: (() => void)[] = [];
    
    // Register all event listeners
    Object.entries(events).forEach(([eventName, handler]) => {
      // Check if the event name matches a SocketEvent enum value
      const socketEvent = Object.values(SocketEvent).find(event => event === eventName);
      if (socketEvent) {
        const unsubscribe = socketService.on(socketEvent, handler);
        unsubscribes.push(unsubscribe);
      } else {
        console.warn(`Event "${eventName}" is not defined in SocketEvent enum`);
      }
    });
    
    // Clean up event listeners on unmount or when events change
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [events, enabled, useNewImplementation]);
  
  // Join a room (compatible with both implementations)
  const joinRoom = useCallback((roomId: string) => {
    if (!enabled) return;

    if (useNewImplementation) {
      socketUtils.joinRoom(roomId);
    } else {
      socketService.emit('join:ticket', roomId);
    }
  }, [enabled, useNewImplementation]);
  
  // Leave a room (compatible with both implementations)
  const leaveRoom = useCallback((roomId: string) => {
    if (!enabled) return;

    if (useNewImplementation) {
      socketUtils.leaveRoom(roomId);
    } else {
      socketService.emit('leave:ticket', roomId);
    }
  }, [enabled, useNewImplementation]);
  
  // Send a message to the server (compatible with both implementations)
  const emit = useCallback((eventName: string, data: any) => {
    if (!enabled) return false;

    if (useNewImplementation) {
      if (socket && isConnected) {
        socket.emit(eventName, data);
        return true;
      }
    } else {
      if (socketService.isSocketConnected()) {
        socketService.emit(eventName, data);
        return true;
      }
    }
    return false;
  }, [socket, isConnected, enabled, useNewImplementation]);

  // For compatibility with the legacy implementation
  const on = useCallback((event: SocketEvent, callback: (data: any) => void) => {
    return socketService.on(event, callback);
  }, []);

  return {
    isConnected,
    joinRoom,
    leaveRoom,
    emit,
    on,
    socketEvents: SocketEvent
  };
};

export default useSocket; 