import { SocketEvent } from './socketService';
import { NotificationType } from '../redux/slices/notificationSlice';

// Mock users with status
export const mockUsers = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    status: 'online',
    lastActive: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    status: 'away',
    lastActive: new Date(Date.now() - 10 * 60000).toISOString() // 10 minutes ago
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    status: 'busy',
    lastActive: new Date(Date.now() - 5 * 60000).toISOString() // 5 minutes ago
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    status: 'offline',
    lastActive: new Date(Date.now() - 120 * 60000).toISOString() // 2 hours ago
  }
];

// Mock notifications
export const mockNotifications = [
  {
    id: '1',
    type: NotificationType.SUCCESS,
    title: 'New User Registration',
    message: 'John Doe just signed up to the platform',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString() // 15 minutes ago
  },
  {
    id: '2',
    type: NotificationType.INFO,
    title: 'System Update',
    message: 'The system will undergo maintenance at 2 AM tonight',
    read: false,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString() // 1 hour ago
  },
  {
    id: '3',
    type: NotificationType.WARNING,
    title: 'Disk Space Low',
    message: 'Your account storage is at 80% capacity',
    read: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString() // 3 hours ago
  },
  {
    id: '4',
    type: NotificationType.ERROR,
    title: 'Payment Failed',
    message: 'Your last payment attempt was unsuccessful',
    read: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60000).toISOString() // 5 hours ago
  }
];

// Mock events to simulate on a timer
export const mockEvents = [
  {
    event: SocketEvent.USER_STATUS_CHANGE,
    data: {
      user: {
        ...mockUsers[1],
        status: 'online',
        lastActive: new Date().toISOString()
      }
    },
    delay: 10000 // 10 seconds
  },
  {
    event: SocketEvent.USER_STATUS_CHANGE,
    data: {
      user: {
        ...mockUsers[2],
        status: 'away',
        lastActive: new Date().toISOString()
      }
    },
    delay: 15000 // 15 seconds
  },
  {
    event: SocketEvent.NOTIFICATION_NEW,
    data: {
      id: '5',
      type: NotificationType.INFO,
      title: 'New Message',
      message: 'You have a new message from Alex Johnson',
      read: false,
      createdAt: new Date().toISOString()
    },
    delay: 20000 // 20 seconds
  },
  {
    event: SocketEvent.USER_STATUS_CHANGE,
    data: {
      user: {
        ...mockUsers[3],
        status: 'online',
        lastActive: new Date().toISOString()
      }
    },
    delay: 25000 // 25 seconds
  }
];

// Function to simulate server responses to specific client events
export const mockServerResponses: Record<string, any> = {
  'users:getActive': {
    users: mockUsers
  },
  'notifications:fetch': mockNotifications
}; 