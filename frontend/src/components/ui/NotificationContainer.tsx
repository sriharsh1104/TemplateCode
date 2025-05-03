import React, { useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import './NotificationContainer.scss';

const NotificationContainer: React.FC = () => {
  const { notifications, markAsRead, removeNotification } = useNotifications();
  
  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    const autoDismissTimers: NodeJS.Timeout[] = [];
    
    notifications.forEach(notification => {
      if (!notification.read) {
        const timer = setTimeout(() => {
          markAsRead(notification.id);
        }, 5000);
        
        autoDismissTimers.push(timer);
      }
    });
    
    return () => {
      autoDismissTimers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, markAsRead]);
  
  // Only render if there are notifications
  if (!notifications || notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="notification-container">
      {notifications.slice(0, 5).map(notification => (
        <div 
          key={notification.id}
          className={`notification notification-${notification.type} ${notification.read ? 'read' : 'unread'}`}
        >
          <div className="notification-content">
            <h4 className="notification-title">{notification.title}</h4>
            <p className="notification-message">{notification.message}</p>
            <span className="notification-time">
              {new Date(notification.createdAt).toLocaleTimeString()}
            </span>
          </div>
          
          <button 
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer; 