import express from 'express';
import { 
  getNotificationSettings, 
  updateNotificationChannels, 
  updateNotificationPreferences, 
  updateDigestFrequency, 
  updateQuietHours 
} from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Notification settings routes
router.get('/settings', getNotificationSettings);
router.put('/settings/channels', updateNotificationChannels);
router.put('/settings/preferences/:type', updateNotificationPreferences);
router.put('/settings/digest', updateDigestFrequency);
router.put('/settings/quiet-hours', updateQuietHours);

export default router; 