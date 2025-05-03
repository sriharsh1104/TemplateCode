import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';
import User from '../models/User';
import logger from '../utils/logger';

/**
 * Interface for JWT payload
 */
interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

/**
 * Extended Request interface with user property
 */
export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware to protect routes - verifies JWT token and adds user to request
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    
    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check for token in cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }
    
    // Check if token exists
    if (!token) {
      return next(new ApiError('Not authorized to access this route', 401));
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'default_jwt_secret'
      ) as JwtPayload;
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      // Check if user exists
      if (!user) {
        return next(new ApiError('User not found', 404));
      }
      
      // Add user to request
      req.user = user;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return next(new ApiError('Token expired', 401));
      }
      
      if (err instanceof jwt.JsonWebTokenError) {
        return next(new ApiError('Invalid token', 401));
      }
      
      logger.error(`Auth middleware error: ${err}`);
      return next(new ApiError('Not authorized to access this route', 401));
    }
  } catch (err) {
    return next(err);
  }
};

/**
 * Middleware to check if user has required role
 * @param {string[]} roles - Array of authorized roles
 */
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('User not found in request', 500));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    
    next();
  };
}; 