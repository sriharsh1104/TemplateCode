import express from 'express';
import { 
  getAccountSettings, 
  updateAccountSettings, 
  uploadProfileImage, 
  deleteProfileImage,
  getSecuritySettings,
  updateSecuritySettings
} from '../controllers/settingsController';
import { protect } from '../middleware/auth';
import { upload } from '../controllers/settingsController';

const router = express.Router();

// All routes are protected
router.use(protect);

// Account settings routes
router.get('/account', getAccountSettings);
router.put('/account', updateAccountSettings);
router.post('/account/profile-image', upload.single('image'), uploadProfileImage);
router.delete('/account/profile-image', deleteProfileImage);

// Security settings routes
router.get('/security', getSecuritySettings);
router.put('/security', updateSecuritySettings);

export default router; 