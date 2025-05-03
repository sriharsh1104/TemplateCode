import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { SocketEvent } from '../../api/socketService';
import './ConnectionStatus.scss';

const ConnectionStatus: React.FC = () => {
  const { isConnected, on } = useSocket();
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [visible, setVisible] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  
  useEffect(() => {
    // Update status based on connection state
    setStatus(isConnected ? 'connected' : 'disconnected');
    
    // Show the status indicator when connection state changes
    if (isConnected) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [isConnected]);
  
  useEffect(() => {
    // Subscribe to socket events for connection status
    const handleConnect = () => {
      setStatus('connected');
      setVisible(true);
      setReconnectAttempt(0);
      
      // Hide after 3 seconds
      setTimeout(() => {
        setVisible(false);
      }, 3000);
    };
    
    const handleDisconnect = () => {
      setStatus('disconnected');
      setVisible(true);
    };
    
    const handleReconnectAttempt = (attempt: number) => {
      setStatus('connecting');
      setReconnectAttempt(attempt);
      setVisible(true);
    };
    
    // Register event listeners
    const connectUnsubscribe = on(SocketEvent.CONNECT, handleConnect);
    const disconnectUnsubscribe = on(SocketEvent.DISCONNECT, handleDisconnect);
    const reconnectAttemptUnsubscribe = on(SocketEvent.RECONNECT_ATTEMPT, handleReconnectAttempt);
    
    // Cleanup
    return () => {
      connectUnsubscribe();
      disconnectUnsubscribe();
      reconnectAttemptUnsubscribe();
    };
  }, [on]);
  
  // Toggle visibility manually
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  
  if (!visible) {
    return (
      <div className="connection-status-icon" onClick={toggleVisibility}>
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
      </div>
    );
  }
  
  return (
    <div className={`connection-status ${status}`}>
      <div className="connection-status-content">
        <div className="status-icon">
          <div className="status-indicator"></div>
        </div>
        
        <div className="status-text">
          {status === 'connected' && <span>Connected to server</span>}
          {status === 'disconnected' && <span>Disconnected from server</span>}
          {status === 'connecting' && (
            <span>Reconnecting to server (Attempt {reconnectAttempt})</span>
          )}
        </div>
        
        <button className="close-button" onClick={() => setVisible(false)}>
          ×
        </button>
      </div>
    </div>
  );
};

export default ConnectionStatus; 