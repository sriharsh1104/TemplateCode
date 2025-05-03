import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import UserSession from '../models/UserSession';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';

/**
 * @desc    Register a user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError('User with this email already exists', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Send response with token
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ApiError('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ApiError('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ApiError('Invalid credentials', 401));
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Create and store session information
    createSession(user, req, res);

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from authorization header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      // Invalidate the session in database
      await UserSession.findOneAndUpdate(
        { token },
        { isActive: false }
      );
    }

    // Clear cookie if it exists
    if (req.cookies.token) {
      res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user details
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
export const updateDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fields to update
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      username: req.body.username,
      language: req.body.language,
      timezone: req.body.timezone
    };

    // Filter out undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key as keyof typeof fieldsToUpdate] === undefined && delete fieldsToUpdate[key as keyof typeof fieldsToUpdate]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
export const updatePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    // Check current password
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return next(new ApiError('Current password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user sessions
 * @route   GET /api/auth/sessions
 * @access  Private
 */
export const getSessions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessions = await UserSession.find({
      user: req.user.id,
      isActive: true
    }).sort({ lastActive: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Terminate a session
 * @route   DELETE /api/auth/sessions/:id
 * @access  Private
 */
export const terminateSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await UserSession.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!session) {
      return next(new ApiError('Session not found', 404));
    }

    // If terminating current session, also logout
    let shouldLogout = false;
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      shouldLogout = token === session.token;
    }

    // Update session to inactive
    session.isActive = false;
    await session.save();

    // If current session, clear cookie
    if (shouldLogout && req.cookies.token) {
      res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      shouldLogout
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to get token, create cookie and send response
 */
const sendTokenResponse = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Set cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE || '7') * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      data: userResponse
    });
};

/**
 * Helper function to create a user session
 */
const createSession = async (
  user: IUser,
  req: Request,
  res: Response
) => {
  // Create JWT token
  const token = user.getSignedJwtToken();

  // Parse JWT expiration
  const jwtExpire = process.env.JWT_EXPIRE || '7d';
  let expiresAt = new Date();
  
  if (jwtExpire.endsWith('d')) {
    expiresAt.setDate(expiresAt.getDate() + parseInt(jwtExpire));
  } else if (jwtExpire.endsWith('h')) {
    expiresAt.setHours(expiresAt.getHours() + parseInt(jwtExpire));
  } else {
    // Default to 7 days
    expiresAt.setDate(expiresAt.getDate() + 7);
  }

  // Extract device info from user agent
  const userAgent = req.headers['user-agent'] || 'unknown';
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  
  // Determine device type (very basic detection)
  let deviceType: 'desktop' | 'mobile' | 'tablet' | 'other' = 'other';
  if (/mobile/i.test(userAgent)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad/i.test(userAgent)) {
    deviceType = 'tablet';
  } else if (/windows|macintosh|linux/i.test(userAgent)) {
    deviceType = 'desktop';
  }

  // Determine browser
  let browser = 'Unknown Browser';
  if (/chrome/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/firefox/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/safari/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/edge/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/opera/i.test(userAgent)) {
    browser = 'Opera';
  } else if (/msie|trident/i.test(userAgent)) {
    browser = 'Internet Explorer';
  }

  // Determine OS
  let os = 'Unknown OS';
  if (/windows/i.test(userAgent)) {
    os = 'Windows';
  } else if (/macintosh/i.test(userAgent)) {
    os = 'MacOS';
  } else if (/linux/i.test(userAgent)) {
    os = 'Linux';
  } else if (/android/i.test(userAgent)) {
    os = 'Android';
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    os = 'iOS';
  }

  // Create session in database
  await UserSession.create({
    user: user._id,
    token,
    deviceInfo: {
      deviceType,
      browser: `${browser} on ${os}`,
      os,
      ip,
    },
    lastActive: new Date(),
    expiresAt,
    isActive: true
  });

  logger.info(`User ${user._id} logged in from ${deviceType} device`);
}; 