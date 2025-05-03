import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Custom error class for API errors
 * @class ApiError
 * @extends Error
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  /**
   * Create an API error
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {boolean} isOperational - Whether this is an operational error
   */
  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const errorHandler = (
  err: Error | ApiError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}${err.stack ? `\n${err.stack}` : ''}`);
  
  // Default error values
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const message = err.message || 'Server Error';
  const isOperational = 'isOperational' in err ? err.isOperational : false;
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: message,
      validationErrors: err
    });
  }
  
  // Mongoose duplicate key
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `Duplicate value for ${field}. Please use another value.`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token. Please log in again.'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Your token has expired. Please log in again.'
    });
  }
  
  // If we're in development, send detailed error
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      success: false,
      error: message,
      stack: err.stack,
      isOperational
    });
  }
  
  // For production, don't leak error details if it's not operational
  if (!isOperational) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
  
  // Send proper error response for operational errors
  return res.status(statusCode).json({
    success: false,
    error: message
  });
}; 