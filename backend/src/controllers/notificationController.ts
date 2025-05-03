import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import NotificationSetting from '../models/NotificationSetting';
import { ApiError } from '../middleware/errorHandler';
import { notifyUser } from '../socket';

/**
 * @desc    Get notification settings
 * @route   GET /api/notifications/settings
 * @access  Private
 */
export const getNotificationSettings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find or create notification settings for user
    let settings = await NotificationSetting.findOne({ user: req.user.id });
    
    // If settings don't exist, create default settings
    if (!settings) {
      settings = await NotificationSetting.create({
        user: req.user.id,
        // Default values will be used as defined in the model
      });
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update notification channels (email, push, SMS)
 * @route   PUT /api/notifications/settings/channels
 * @access  Private
 */
export const updateNotificationChannels = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, push, sms } = req.body;
    
    // Validate input
    if (email === undefined && push === undefined && sms === undefined) {
      return next(new ApiError('No channel settings provided', 400));
    }
    
    // Build update object
    const channelsUpdate: Record<string, boolean> = {};
    if (email !== undefined) channelsUpdate['channels.email'] = email;
    if (push !== undefined) channelsUpdate['channels.push'] = push;
    if (sms !== undefined) channelsUpdate['channels.sms'] = sms;
    
    // If a channel is disabled, also disable all preference types for that channel
    const preferenceUpdates: Record<string, boolean> = {};
    if (email === false) {
      preferenceUpdates['preferences.account.email'] = false;
      preferenceUpdates['preferences.activity.email'] = false;
      preferenceUpdates['preferences.updates.email'] = false;
      preferenceUpdates['preferences.marketing.email'] = false;
    }
    
    if (push === false) {
      preferenceUpdates['preferences.account.push'] = false;
      preferenceUpdates['preferences.activity.push'] = false;
      preferenceUpdates['preferences.updates.push'] = false;
      preferenceUpdates['preferences.marketing.push'] = false;
    }
    
    if (sms === false) {
      preferenceUpdates['preferences.account.sms'] = false;
      preferenceUpdates['preferences.activity.sms'] = false;
      preferenceUpdates['preferences.updates.sms'] = false;
      preferenceUpdates['preferences.marketing.sms'] = false;
    }
    
    // Find and update settings
    let settings = await NotificationSetting.findOneAndUpdate(
      { user: req.user.id },
      { $set: { ...channelsUpdate, ...preferenceUpdates } },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update notification preferences for a specific type
 * @route   PUT /api/notifications/settings/preferences/:type
 * @access  Private
 */
export const updateNotificationPreferences = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.params;
    const { email, push, sms } = req.body;
    
    // Validate notification type
    const validTypes = ['account', 'activity', 'updates', 'marketing'];
    if (!validTypes.includes(type)) {
      return next(new ApiError(`Invalid notification type: ${type}`, 400));
    }
    
    // Validate input
    if (email === undefined && push === undefined && sms === undefined) {
      return next(new ApiError('No preference settings provided', 400));
    }
    
    // Get current notification settings
    let settings = await NotificationSetting.findOne({ user: req.user.id });
    
    // If settings don't exist, create default settings
    if (!settings) {
      settings = await NotificationSetting.create({
        user: req.user.id
      });
    }
    
    // Build update object
    const preferencesUpdate: Record<string, boolean> = {};
    
    if (email !== undefined) {
      // Only allow enabling if channel is enabled
      if (email === true && !settings.channels.email) {
        return next(new ApiError('Cannot enable email preference when email channel is disabled', 400));
      }
      preferencesUpdate[`preferences.${type}.email`] = email;
    }
    
    if (push !== undefined) {
      // Only allow enabling if channel is enabled
      if (push === true && !settings.channels.push) {
        return next(new ApiError('Cannot enable push preference when push channel is disabled', 400));
      }
      preferencesUpdate[`preferences.${type}.push`] = push;
    }
    
    if (sms !== undefined) {
      // Only allow enabling if channel is enabled
      if (sms === true && !settings.channels.sms) {
        return next(new ApiError('Cannot enable SMS preference when SMS channel is disabled', 400));
      }
      preferencesUpdate[`preferences.${type}.sms`] = sms;
    }
    
    // Update settings
    settings = await NotificationSetting.findOneAndUpdate(
      { user: req.user.id },
      { $set: preferencesUpdate },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update digest frequency
 * @route   PUT /api/notifications/settings/digest
 * @access  Private
 */
export const updateDigestFrequency = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { digestFrequency } = req.body;
    
    // Validate frequency
    const validFrequencies = ['daily', 'weekly', 'never'];
    if (!validFrequencies.includes(digestFrequency)) {
      return next(new ApiError(`Invalid digest frequency: ${digestFrequency}`, 400));
    }
    
    // Update settings
    const settings = await NotificationSetting.findOneAndUpdate(
      { user: req.user.id },
      { digestFrequency },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update quiet hours
 * @route   PUT /api/notifications/settings/quiet-hours
 * @access  Private
 */
export const updateQuietHours = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { enabled, start, end } = req.body;
    
    // Validate input
    if (enabled === undefined && start === undefined && end === undefined) {
      return next(new ApiError('No quiet hours settings provided', 400));
    }
    
    // Build update object
    const quietHoursUpdate: Record<string, any> = {};
    
    if (enabled !== undefined) quietHoursUpdate['quietHours.enabled'] = enabled;
    if (start !== undefined) {
      // Validate time format (HH:MM)
      if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(start)) {
        return next(new ApiError('Invalid start time format. Use HH:MM (24-hour format)', 400));
      }
      quietHoursUpdate['quietHours.start'] = start;
    }
    
    if (end !== undefined) {
      // Validate time format (HH:MM)
      if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(end)) {
        return next(new ApiError('Invalid end time format. Use HH:MM (24-hour format)', 400));
      }
      quietHoursUpdate['quietHours.end'] = end;
    }
    
    // Update settings
    const settings = await NotificationSetting.findOneAndUpdate(
      { user: req.user.id },
      { $set: quietHoursUpdate },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send notification to a user
 * @route   POST /api/notifications/send
 * @access  Private
 */
export const sendNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, type, title, message } = req.body;
    
    // Validate input
    if (!userId || !type || !title || !message) {
      return next(new ApiError('userId, type, title, and message are required', 400));
    }
    
    // Check if user exists
    const userSettings = await NotificationSetting.findOne({ user: userId });
    
    if (!userSettings) {
      return next(new ApiError('User not found', 404));
    }
    
    // Check if the notification type is enabled for push
    let shouldSend = false;
    
    if (type === 'account' && userSettings.preferences.account.push) {
      shouldSend = true;
    } else if (type === 'activity' && userSettings.preferences.activity.push) {
      shouldSend = true;
    } else if (type === 'updates' && userSettings.preferences.updates.push) {
      shouldSend = true;
    } else if (type === 'marketing' && userSettings.preferences.marketing.push) {
      shouldSend = true;
    }
    
    if (shouldSend && userSettings.channels.push) {
      // Check quiet hours
      if (userSettings.quietHours.enabled) {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // If current time is within quiet hours, don't send notification
        if (isTimeInRange(currentTime, userSettings.quietHours.start, userSettings.quietHours.end)) {
          return res.status(200).json({
            success: true,
            data: {
              sent: false,
              reason: 'Quiet hours enabled'
            }
          });
        }
      }
      
      // Send notification via socket.io
      notifyUser(userId, 'notification', {
        type,
        title,
        message,
        timestamp: new Date()
      });
      
      res.status(200).json({
        success: true,
        data: {
          sent: true
        }
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          sent: false,
          reason: 'Push notifications disabled for this type'
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to check if a time is within a range
 * @param {string} time - Current time (HH:MM)
 * @param {string} start - Start time (HH:MM)
 * @param {string} end - End time (HH:MM)
 * @returns {boolean} - Whether time is in range
 */
const isTimeInRange = (time: string, start: string, end: string): boolean => {
  // Convert to minutes for easier comparison
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  
  // If end time is earlier than start time, it means range crosses midnight
  if (endMinutes < startMinutes) {
    return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
  }
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};

/**
 * Helper function to convert time to minutes
 * @param {string} time - Time in HH:MM format
 * @returns {number} - Time in minutes
 */
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}; 