import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { ApiError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import sharp from 'sharp';
import logger from '../utils/logger';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/profile');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename using userId and timestamp
    const userId = (req as AuthRequest).user?.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `user_${userId}_${timestamp}${ext}`);
  }
});

// Configure file filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed') as any);
  }
};

// Configure multer upload
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  }
});

/**
 * @desc    Get account settings
 * @route   GET /api/settings/account
 * @access  Private
 */
export const getAccountSettings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ApiError('User not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        username: user.username || '',
        language: user.language,
        timezone: user.timezone,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update account settings
 * @route   PUT /api/settings/account
 * @access  Private
 */
export const updateAccountSettings = async (
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
      timezone: req.body.timezone,
    };
    
    // Filter out undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key as keyof typeof fieldsToUpdate] === undefined && 
      delete fieldsToUpdate[key as keyof typeof fieldsToUpdate]
    );
    
    // Check if email is being updated and if it's already in use
    if (fieldsToUpdate.email) {
      const existingUser = await User.findOne({ 
        email: fieldsToUpdate.email,
        _id: { $ne: req.user.id }
      });
      
      if (existingUser) {
        return next(new ApiError('Email already in use', 400));
      }
    }
    
    // Check if username is being updated and if it's already in use
    if (fieldsToUpdate.username) {
      const existingUser = await User.findOne({
        username: fieldsToUpdate.username,
        _id: { $ne: req.user.id }
      });
      
      if (existingUser) {
        return next(new ApiError('Username already in use', 400));
      }
    }
    
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
 * @desc    Upload profile image
 * @route   POST /api/settings/account/profile-image
 * @access  Private
 */
export const uploadProfileImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next(new ApiError('Please upload a file', 400));
    }
    
    // Process the image with sharp
    const processedFilename = `processed_${path.basename(req.file.path)}`;
    const processedFilePath = path.join(path.dirname(req.file.path), processedFilename);
    
    // Resize, optimize, and save image
    await sharp(req.file.path)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(processedFilePath);
      
    // Remove original file
    fs.unlinkSync(req.file.path);
    
    // Get relative path for database storage
    const relativePath = path.join('/uploads/profile', processedFilename);
    
    // Update user profile image path in database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: relativePath },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: {
        profileImage: relativePath
      }
    });
  } catch (error) {
    // If error occurs, clean up any uploaded files
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) logger.error(`Error deleting file: ${err.message}`);
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete profile image
 * @route   DELETE /api/settings/account/profile-image
 * @access  Private
 */
export const deleteProfileImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ApiError('User not found', 404));
    }
    
    // Check if user has a profile image
    if (!user.profileImage) {
      return next(new ApiError('No profile image to delete', 400));
    }
    
    // Delete the file
    const filePath = path.join(__dirname, '../../', user.profileImage.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Update user profile
    user.profileImage = undefined;
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get security settings
 * @route   GET /api/settings/security
 * @access  Private
 */
export const getSecuritySettings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ApiError('User not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: {
        twoFactorEnabled: user.twoFactorEnabled,
        recoveryEmail: user.recoveryEmail || ''
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update security settings
 * @route   PUT /api/settings/security
 * @access  Private
 */
export const updateSecuritySettings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fields to update
    const fieldsToUpdate = {
      twoFactorEnabled: req.body.twoFactorEnabled,
      recoveryEmail: req.body.recoveryEmail
    };
    
    // Filter out undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key as keyof typeof fieldsToUpdate] === undefined &&
      delete fieldsToUpdate[key as keyof typeof fieldsToUpdate]
    );
    
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: {
        twoFactorEnabled: user?.twoFactorEnabled,
        recoveryEmail: user?.recoveryEmail
      }
    });
  } catch (error) {
    next(error);
  }
}; 