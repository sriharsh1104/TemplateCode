import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { IUser } from './models/User';
import UserSession from './models/UserSession';
import logger from './utils/logger';

// User-socket mapping to track connections
const userSocketMap = new Map<string, Set<string>>();

// Socket instance for use in other modules
export let io: Server;

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

/**
 * Initializes and configures Socket.IO server
 * @param {HTTPServer} server - HTTP server instance
 */
export const initializeSocket = (server: HTTPServer): void => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware for authentication
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      // Get token from cookies or auth header
      let token: string | undefined;
      
      // Check cookies
      if (socket.handshake.headers.cookie) {
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        token = cookies.token;
      }
      
      // Check auth header
      const authHeader = socket.handshake.auth.token || socket.handshake.headers.authorization;
      if (authHeader && typeof authHeader === 'string') {
        // Remove Bearer prefix if present
        token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
      }
      
      if (!token) {
        return next(new Error('Authentication required'));
      }
      
      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'default_jwt_secret'
      ) as { id: string };
      
      // Check if the session is active in the database
      const session = await UserSession.findOne({ 
        token, 
        isActive: true,
        expiresAt: { $gt: new Date() }
      });
      
      if (!session) {
        return next(new Error('Session expired or invalid'));
      }
      
      // Attach user ID to socket
      socket.userId = decoded.id;
      
      // Update last active timestamp
      await UserSession.findByIdAndUpdate(session._id, {
        lastActive: new Date()
      });
      
      next();
    } catch (error) {
      logger.error(`Socket authentication error: ${error}`);
      next(new Error('Authentication failed'));
    }
  });

  // Handle connections
  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId;
    const socketId = socket.id;
    
    if (userId) {
      // Add to user-socket mapping
      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
      }
      userSocketMap.get(userId)?.add(socketId);
      
      // Join user-specific room
      socket.join(`user:${userId}`);
      
      logger.info(`User ${userId} connected with socket ${socketId}`);
      
      // Handle support ticket room joins
      socket.on('join:ticket', (ticketId: string) => {
        socket.join(`ticket:${ticketId}`);
        logger.info(`User ${userId} joined ticket ${ticketId}`);
      });
      
      // Handle support ticket room leaves
      socket.on('leave:ticket', (ticketId: string) => {
        socket.leave(`ticket:${ticketId}`);
        logger.info(`User ${userId} left ticket ${ticketId}`);
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        // Remove from user-socket mapping
        userSocketMap.get(userId)?.delete(socketId);
        if (userSocketMap.get(userId)?.size === 0) {
          userSocketMap.delete(userId);
        }
        
        logger.info(`User ${userId} disconnected from socket ${socketId}`);
      });
    }
  });
  
  logger.info('Socket.IO server initialized');
};

/**
 * Send notification to a specific user
 * @param {string} userId - ID of the user to notify
 * @param {string} event - Event name
 * @param {any} data - Data to send
 */
export const notifyUser = (userId: string, event: string, data: any): void => {
  io.to(`user:${userId}`).emit(event, data);
};

/**
 * Send notification to all connected users
 * @param {string} event - Event name
 * @param {any} data - Data to send
 */
export const notifyAll = (event: string, data: any): void => {
  io.emit(event, data);
};

/**
 * Send notification to a specific room
 * @param {string} room - Room name
 * @param {string} event - Event name
 * @param {any} data - Data to send
 */
export const notifyRoom = (room: string, event: string, data: any): void => {
  io.to(room).emit(event, data);
};

/**
 * Check if a user is online
 * @param {string} userId - ID of the user to check
 * @returns {boolean} - Whether the user is online
 */
export const isUserOnline = (userId: string): boolean => {
  return userSocketMap.has(userId) && (userSocketMap.get(userId)?.size || 0) > 0;
}; 