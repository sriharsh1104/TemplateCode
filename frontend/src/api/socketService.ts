import { io, Socket } from 'socket.io-client';
import store from '../redux/store';
import { showLoader, hideLoader } from '../redux/slices/loadingSlice';
import env from '../utils/env';

// Define event types for better type safety
export enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  CONNECT_ERROR = 'connect_error',
  RECONNECT_ATTEMPT = 'reconnect_attempt',
  RECONNECT = 'reconnect',
  
  // Auth events
  AUTH_STATE_CHANGE = 'auth:stateChange',
  AUTH_SESSION_EXPIRED = 'auth:sessionExpired',
  AUTH_LOGGED_OUT = 'auth:loggedOut',
  AUTH_NEW_LOGIN = 'auth:newLogin',
  
  // User events
  USER_STATUS_CHANGE = 'user:statusChange',
  USER_DATA_UPDATE = 'user:dataUpdate',
  USERS_ACTIVE = 'users-active',
  
  // Notification events
  NOTIFICATION_NEW = 'notification:new',
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_CLEAR = 'notification:clear',
  NOTIFICATIONS_LIST = 'notifications-list',
}

// Type for listeners
type SocketListener = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<SocketListener>> = new Map();
  private url: string;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private connectionEnabled: boolean = true;
  
  constructor(url: string) {
    this.url = url;
    this.listeners = new Map();
  }
  
  // Initialize socket connection
  public init(token?: string): void {
    // If backend is not available, don't keep trying to connect
    if (!this.connectionEnabled) {
      console.log('Socket connection is disabled due to repeated failures');
      return;
    }
    
    // Cleanup any existing connection
    if (this.socket) {
      this.socket.disconnect();
    }
    
    try {
      const options = {
        transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        autoConnect: true,
        forceNew: true, // Force a new connection
        withCredentials: true, // Allow sending cookies
        auth: token ? { token } : undefined,
      };
      
      console.log(`Initializing socket connection to ${this.url}`);
      this.socket = io(this.url, options);
      
      // Setup default event handlers
      this.socket.on(SocketEvent.CONNECT, () => {
        console.log('Socket connected successfully');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emitToListeners(SocketEvent.CONNECT, null);
      });
      
      this.socket.on(SocketEvent.DISCONNECT, (reason) => {
        console.log(`Socket disconnected: ${reason}`);
        this.isConnected = false;
        this.emitToListeners(SocketEvent.DISCONNECT, reason);
      });
      
      this.socket.on(SocketEvent.CONNECT_ERROR, (error) => {
        console.error('Socket connection error:', error);
        this.reconnectAttempts++;
        
        // If we've exceeded max reconnect attempts, disable socket connection
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.warn(`Socket connection failed after ${this.maxReconnectAttempts} attempts. Socket connection disabled.`);
          this.connectionEnabled = false;
        }
        
        this.emitToListeners(SocketEvent.ERROR, error);
      });
      
      this.socket.on(SocketEvent.RECONNECT_ATTEMPT, (attempt) => {
        console.log(`Socket reconnecting... Attempt: ${attempt}`);
        this.reconnectAttempts = attempt;
        this.emitToListeners(SocketEvent.RECONNECT_ATTEMPT, attempt);
      });
      
      this.socket.on(SocketEvent.RECONNECT, () => {
        console.log('Socket reconnected');
        this.emitToListeners(SocketEvent.RECONNECT, null);
      });
      
      // Handle auth events
      this.socket.on(SocketEvent.AUTH_SESSION_EXPIRED, (data) => {
        console.log('Auth session expired');
        this.emitToListeners(SocketEvent.AUTH_SESSION_EXPIRED, data);
      });
      
      this.socket.on(SocketEvent.AUTH_LOGGED_OUT, (data) => {
        console.log('User logged out from another device');
        this.emitToListeners(SocketEvent.AUTH_LOGGED_OUT, data);
      });
      
      this.socket.on(SocketEvent.AUTH_NEW_LOGIN, (data) => {
        console.log('New login detected on another device');
        this.emitToListeners(SocketEvent.AUTH_NEW_LOGIN, data);
      });
      
      // Handle user events
      this.socket.on(SocketEvent.USER_STATUS_CHANGE, (data) => {
        this.emitToListeners(SocketEvent.USER_STATUS_CHANGE, data);
      });
      
      this.socket.on(SocketEvent.USER_DATA_UPDATE, (data) => {
        this.emitToListeners(SocketEvent.USER_DATA_UPDATE, data);
      });
      
      // Handle notification events
      this.socket.on(SocketEvent.NOTIFICATION_NEW, (data) => {
        this.emitToListeners(SocketEvent.NOTIFICATION_NEW, data);
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
      this.isConnected = false;
      this.emitToListeners(SocketEvent.ERROR, error);
    }
  }
  
  // Enable socket connection (can be used to retry after disabling)
  public enableConnection(): void {
    this.connectionEnabled = true;
    this.reconnectAttempts = 0;
  }
  
  // Update auth token (useful after re-authentication)
  public updateToken(token: string): void {
    if (!this.connectionEnabled) {
      this.enableConnection(); // Retry connection when token is updated
    }
    
    if (this.socket) {
      this.socket.auth = { token };
      if (!this.isConnected) {
        this.socket.connect();
      }
    } else {
      // Initialize if socket doesn't exist
      this.init(token);
    }
  }
  
  // Disconnect socket
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
  }
  
  // Check if socket is connected
  public isSocketConnected(): boolean {
    return this.isConnected;
  }
  
  // Add event listener
  public on(event: SocketEvent, callback: SocketListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)!.add(callback);
    
    // Return a function to remove this listener
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
      }
    };
  }
  
  // Remove event listener
  public off(event: SocketEvent, callback: SocketListener): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }
  
  // Emit event to server
  public emit(event: string, data?: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit ${event}, socket not connected`);
    }
  }
  
  // Emit to registered listeners
  private emitToListeners(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }
}

// Create a singleton instance with the API URL
const socketService = new SocketService(env.REACT_APP_SOCKET_URL);

export default socketService; 