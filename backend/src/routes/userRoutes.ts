import express from 'express';
import { updateDetails } from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Regular user routes
router.put('/me', updateDetails);

// Admin only routes
router.use(authorize(['admin']));
// Any admin-specific user management routes would go here

export default router; 