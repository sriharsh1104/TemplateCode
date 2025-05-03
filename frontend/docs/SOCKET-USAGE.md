# WebSocket Implementation Guide

This document explains how to use the WebSocket functionality in the application.

## Overview

The application uses Socket.IO for real-time communication between the client and server. This enables features like:

- Real-time notifications
- Live support ticket updates
- User presence tracking
- Chat functionality

## Configuration

WebSocket configuration is managed through environment variables:

- `REACT_APP_SOCKET_URL`: The URL of the WebSocket server (e.g., `http://localhost:5000`)
- `REACT_APP_ENABLE_SOCKET`: Boolean flag to enable/disable WebSocket functionality
- `REACT_APP_SOCKET_RECONNECT_ATTEMPTS`: Number of reconnection attempts
- `REACT_APP_SOCKET_RECONNECT_DELAY`: Delay between reconnection attempts (ms)

## Architecture

The WebSocket implementation consists of several components:

1. **Socket Utility** (`src/utils/socket.ts`): Manages the Socket.IO client instance
2. **Socket Hook** (`src/hooks/useSocket.ts`): Custom React hook for using sockets in components
3. **Socket Manager** (`src/components/SocketManager.tsx`): Top-level component for global socket management

## Authentication

WebSockets are authenticated using JWT tokens. The token is sent to the server:

1. In the connection auth parameter
2. As a cookie (for cross-domain support)

## Usage Examples

### Global Socket Connection

The SocketManager component handles the global socket connection and is initialized in App.tsx:

```tsx
// In App.tsx
{token && user?.isAuthenticated && <SocketManager token={token} />}
```

### Using WebSockets in Components

#### Basic Usage

```tsx
import useSocket from '../hooks/useSocket';

function MyComponent() {
  // Initialize socket hook
  const { isConnected, emit } = useSocket();
  
  // Send a message
  const handleSendMessage = () => {
    emit('custom_event', { message: 'Hello server!' });
  };
  
  return (
    <div>
      <p>Connection status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
}
```

#### With Event Listeners

```tsx
import useSocket from '../hooks/useSocket';

function NotificationComponent() {
  const [notifications, setNotifications] = useState([]);
  
  // Initialize socket with event listeners
  const { isConnected } = useSocket({
    events: {
      notification: (data) => {
        setNotifications(prev => [...prev, data]);
      }
    }
  });
  
  return (
    <div>
      <h3>Notifications ({notifications.length})</h3>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### Joining and Leaving Rooms

```tsx
import useSocket from '../hooks/useSocket';

function ChatRoom({ roomId }) {
  const { joinRoom, leaveRoom } = useSocket();
  
  // Join room on mount
  useEffect(() => {
    joinRoom(roomId);
    
    // Leave room on unmount
    return () => {
      leaveRoom(roomId);
    };
  }, [roomId, joinRoom, leaveRoom]);
  
  return <div>In chat room: {roomId}</div>;
}
```

## Server-Side Events

The server emits the following events:

| Event | Description | Payload |
|-------|-------------|---------|
| `notification` | User notification | `{ type, title, message, timestamp }` |
| `ticket_message` | New support ticket message | `{ ticketId, message }` |
| `ticket_update` | Support ticket status change | `{ ticketId, status }` |
| `ticket_status` | Ticket status update | `{ ticketId, status }` |

## Client-Side Events

The client can emit the following events:

| Event | Description | Payload |
|-------|-------------|---------|
| `join:ticket` | Join a ticket room | `ticketId` |
| `leave:ticket` | Leave a ticket room | `ticketId` |

## Error Handling

Socket connection errors are logged to the console and can be handled by subscribing to the `connect_error` event. The socket will automatically attempt to reconnect based on the configuration.

## Best Practices

1. Use the `useSocket` hook for component-specific socket functionality
2. Use `SocketManager` for application-wide socket functionality
3. Always handle connection status to provide feedback to users
4. Clean up event listeners when components unmount
5. Use rooms for scoped communication (e.g., support tickets) 