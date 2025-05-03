import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  addNotification, 
  markAsRead, 
  markAllAsRead, 
  removeNotification, 
  setNotifications,
  clearNotifications,
  selectNotifications,
  Notification 
} from '../redux/slices/notificationSlice';
import { useSocket } from './useSocket';
import { SocketEvent } from '../api/socketService';
import { selectAuth } from '../redux/slices/authSlice';

// Hook for managing notifications with socket support
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector(selectNotifications);
  const { isAuthenticated } = useAppSelector(selectAuth);
  const { on, emit, socketEvents, isConnected } = useSocket();

  // Listen for incoming notifications from socket
  useEffect(() => {
    if (isAuthenticated && isConnected) {
      // Handler for new notifications
      const newNotificationHandler = (notification: Notification) => {
        dispatch(addNotification(notification));
      };

      // Handler for notification read status updates
      const notificationReadHandler = (notificationId: string) => {
        dispatch(markAsRead(notificationId));
      };

      // Handler for notification removal
      const notificationClearHandler = (notificationId: string) => {
        dispatch(removeNotification(notificationId));
      };

      // Subscribe to socket events
      const newNotificationUnsubscribe = on(SocketEvent.NOTIFICATION_NEW, newNotificationHandler);
      const notificationReadUnsubscribe = on(SocketEvent.NOTIFICATION_READ, notificationReadHandler);
      const notificationClearUnsubscribe = on(SocketEvent.NOTIFICATION_CLEAR, notificationClearHandler);

      // Fetch initial notifications when socket connects
      emit('notifications:fetch');

      return () => {
        // Cleanup socket event listeners
        newNotificationUnsubscribe();
        notificationReadUnsubscribe();
        notificationClearUnsubscribe();
      };
    }
  }, [dispatch, isAuthenticated, isConnected, on, emit]);

  // Function to mark a notification as read
  const markNotificationAsRead = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
    
    // Emit socket event to sync with server
    if (isConnected) {
      emit('notification:markAsRead', notificationId);
    }
  };

  // Function to mark all notifications as read
  const markAllNotificationsAsRead = () => {
    dispatch(markAllAsRead());
    
    // Emit socket event to sync with server
    if (isConnected) {
      emit('notification:markAllAsRead');
    }
  };

  // Function to remove a notification
  const removeNotificationById = (notificationId: string) => {
    dispatch(removeNotification(notificationId));
    
    // Emit socket event to sync with server
    if (isConnected) {
      emit('notification:remove', notificationId);
    }
  };

  // Function to clear all notifications
  const clearAllNotifications = () => {
    dispatch(clearNotifications());
    
    // Emit socket event to sync with server
    if (isConnected) {
      emit('notification:clearAll');
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    removeNotification: removeNotificationById,
    clearNotifications: clearAllNotifications,
  };
}; 