import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  updateDetails, 
  updatePassword, 
  getSessions, 
  terminateSession 
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/signup', register); // Add alias for frontend compatibility
router.post('/login', login);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);
router.get('/sessions', getSessions);
router.delete('/sessions/:id', terminateSession);

export default router; 