import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import SupportTicket from '../models/SupportTicket';
import User from '../models/User';
import { ApiError } from '../middleware/errorHandler';
import { notifyRoom, notifyUser } from '../socket';

/**
 * @desc    Get all FAQs
 * @route   GET /api/support/faqs
 * @access  Public
 */
export const getFaqs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Mocked FAQs - In a real app, this would come from the database
    const faqs = [
      {
        id: '1',
        question: 'How do I reset my password?',
        answer: 'To reset your password, go to the login page and click on "Forgot Password". Follow the instructions sent to your email to create a new password.',
        category: 'account',
      },
      {
        id: '2',
        question: 'How do I enable two-factor authentication?',
        answer: 'You can enable two-factor authentication in the Security section of your settings. We support authentication apps and SMS verification.',
        category: 'security',
      },
      {
        id: '3',
        question: 'Can I change my email address?',
        answer: 'Yes, you can change your email address in the Account section of your settings. You will need to verify the new email address before the change takes effect.',
        category: 'account',
      },
      {
        id: '4',
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel your subscription in the Billing section of your settings. If you cancel, you will still have access until the end of your current billing period.',
        category: 'billing',
      },
      {
        id: '5',
        question: 'What happens to my data when I delete my account?',
        answer: 'When you delete your account, all your personal data will be permanently removed from our systems within 30 days, in accordance with our privacy policy.',
        category: 'privacy',
      },
    ];
    
    // Filter by category if provided
    const { category } = req.query;
    let filteredFaqs = faqs;
    
    if (category && category !== 'all') {
      filteredFaqs = faqs.filter(faq => faq.category === category);
    }
    
    res.status(200).json({
      success: true,
      count: filteredFaqs.length,
      data: filteredFaqs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get system status
 * @route   GET /api/support/system-status
 * @access  Public
 */
export const getSystemStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Mocked system status - In a real app, this would come from monitoring
    const systemStatus = [
      { service: 'API', status: 'operational' },
      { service: 'Web App', status: 'operational' },
      { service: 'Database', status: 'operational' },
      { service: 'Authentication', status: 'operational' },
      { service: 'Payment Processing', status: 'maintenance', message: 'Scheduled maintenance from 2AM to 4AM UTC' },
      { service: 'Email Delivery', status: 'issue', message: 'Experiencing delays in email delivery' },
    ];
    
    res.status(200).json({
      success: true,
      count: systemStatus.length,
      data: systemStatus
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a support ticket
 * @route   POST /api/support/tickets
 * @access  Private
 */
export const createTicket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subject, description, priority, contactEmail } = req.body;
    
    // Validate inputs
    if (!subject || !description || !contactEmail) {
      return next(new ApiError('Please provide subject, description, and contact email', 400));
    }
    
    // Create initial message from user
    const initialMessage = {
      sender: 'user',
      message: description,
      timestamp: new Date()
    };
    
    // Create ticket
    const ticket = await SupportTicket.create({
      user: req.user.id,
      subject,
      description,
      priority: priority || 'medium',
      contactEmail,
      status: 'open',
      messages: [initialMessage]
    });
    
    // Get user data for notification
    const user = await User.findById(req.user.id).select('name email');
    
    // Notify admins about new ticket (in a real app, admin IDs would be fetched from DB)
    notifyUser('admin', 'new_ticket', {
      ticketId: ticket._id,
      subject: ticket.subject,
      priority: ticket.priority,
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email
      }
    });
    
    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tickets for a user
 * @route   GET /api/support/tickets
 * @access  Private
 */
export const getTickets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get query parameters
    const { status } = req.query;
    
    // Build query
    const query: any = { user: req.user.id };
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Find tickets
    const tickets = await SupportTicket.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single ticket
 * @route   GET /api/support/tickets/:id
 * @access  Private
 */
export const getTicket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!ticket) {
      return next(new ApiError('Ticket not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a message to a ticket
 * @route   POST /api/support/tickets/:id/messages
 * @access  Private
 */
export const addTicketMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    
    // Validate message
    if (!message) {
      return next(new ApiError('Please provide a message', 400));
    }
    
    // Find ticket
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!ticket) {
      return next(new ApiError('Ticket not found', 404));
    }
    
    // Check if ticket is closed
    if (ticket.status === 'closed') {
      return next(new ApiError('Cannot add message to a closed ticket', 400));
    }
    
    // Add message
    ticket.messages.push({
      sender: 'user',
      message,
      timestamp: new Date()
    });
    
    // Update status if resolved
    if (ticket.status === 'resolved') {
      ticket.status = 'open';
    }
    
    // Update lastUpdated
    ticket.lastUpdated = new Date();
    
    // Save ticket
    await ticket.save();
    
    // Notify room about new message
    notifyRoom(`ticket:${ticket._id}`, 'ticket_message', {
      ticketId: ticket._id,
      message: {
        sender: 'user',
        message,
        timestamp: new Date()
      }
    });
    
    // Also notify support staff about new customer message
    notifyUser('admin', 'ticket_update', {
      ticketId: ticket._id,
      subject: ticket.subject,
      status: ticket.status,
      hasNewMessage: true
    });
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Close a ticket
 * @route   PUT /api/support/tickets/:id/close
 * @access  Private
 */
export const closeTicket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find ticket
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!ticket) {
      return next(new ApiError('Ticket not found', 404));
    }
    
    // Update status
    ticket.status = 'closed';
    ticket.lastUpdated = new Date();
    
    // Save ticket
    await ticket.save();
    
    // Notify user about ticket status change
    notifyUser(ticket.user.toString(), 'ticket_status', {
      ticketId: ticket._id,
      status: 'closed'
    });
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
}; 