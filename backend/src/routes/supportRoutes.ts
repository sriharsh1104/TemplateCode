import express from 'express';
import { 
  getFaqs, 
  getSystemStatus, 
  createTicket, 
  getTickets, 
  getTicket, 
  addTicketMessage, 
  closeTicket 
} from '../controllers/supportController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/faqs', getFaqs);
router.get('/system-status', getSystemStatus);

// Protected routes
router.use('/tickets', protect);
router.route('/tickets')
  .get(getTickets)
  .post(createTicket);

router.route('/tickets/:id')
  .get(getTicket);

router.post('/tickets/:id/messages', addTicketMessage);
router.put('/tickets/:id/close', closeTicket);

export default router; 