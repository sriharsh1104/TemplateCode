import React, { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { SocketEvent } from '../../api/socketService';
import './UserStatusWidget.scss';

interface UserStatus {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastActive: string;
}

const UserStatusWidget: React.FC = () => {
  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { on, emit, isConnected } = useSocket();
  
  useEffect(() => {
    if (isConnected) {
      // Initial fetch of active users
      setIsLoading(true);
      emit('users:getActive');
      
      // Handle user status updates
      const handleStatusChange = (data: { user: UserStatus }) => {
        setUserStatuses(prev => {
          const userIndex = prev.findIndex(u => u.id === data.user.id);
          if (userIndex !== -1) {
            // Update existing user
            const updatedUsers = [...prev];
            updatedUsers[userIndex] = data.user;
            return updatedUsers;
          } else {
            // Add new user
            return [...prev, data.user];
          }
        });
      };
      
      // Handle receiving active users list
      const handleActiveUsers = (data: { users: UserStatus[] }) => {
        setUserStatuses(data.users);
        setIsLoading(false);
      };
      
      // Subscribe to socket events
      const statusChangeUnsubscribe = on(SocketEvent.USER_STATUS_CHANGE, handleStatusChange);
      
      // Set up listener for active users response
      const activeUsersUnsubscribe = on(SocketEvent.USERS_ACTIVE, handleActiveUsers);
            
      return () => {
        // Cleanup event listeners
        statusChangeUnsubscribe();
        activeUsersUnsubscribe();
      };
    } else {
      // Not connected, show empty state
      setIsLoading(false);
    }
  }, [isConnected, on, emit]);
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'online': return 'status-badge-online';
      case 'offline': return 'status-badge-offline';
      case 'away': return 'status-badge-away';
      case 'busy': return 'status-badge-busy';
      default: return 'status-badge-offline';
    }
  };
  
  // Format time since last active
  const formatLastActive = (lastActive: string) => {
    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const diffMs = now.getTime() - lastActiveDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };
  
  if (isLoading) {
    return (
      <div className="user-status-widget">
        <h3 className="widget-title">Team Status</h3>
        <div className="user-status-loading">Loading team status...</div>
      </div>
    );
  }
  
  return (
    <div className="user-status-widget">
      <h3 className="widget-title">Team Status</h3>
      
      <div className="user-status-list">
        {userStatuses.length === 0 ? (
          <div className="no-users-message">
            {isConnected ? 'No team members online' : 'Connect to see team status'}
          </div>
        ) : (
          userStatuses.map(user => (
            <div key={user.id} className="user-status-item">
              <div className="user-avatar">
                <span className="user-initial">{user.name.charAt(0)}</span>
                <span className={`status-badge ${getStatusBadgeClass(user.status)}`}></span>
              </div>
              
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-status">
                  <span className="status-text">{user.status}</span>
                  <span className="status-time">{formatLastActive(user.lastActive)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="connection-status">
        {isConnected ? 
          <span className="connection-active">Live updates active</span> : 
          <span className="connection-inactive">Offline mode</span>
        }
      </div>
    </div>
  );
};

export default UserStatusWidget; 