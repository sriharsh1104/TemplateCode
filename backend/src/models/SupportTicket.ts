import mongoose, { Document, Schema } from 'mongoose';

/**
 * TicketMessage document interface
 */
interface TicketMessage {
  sender: 'user' | 'support';
  message: string;
  timestamp: Date;
}

/**
 * SupportTicket document interface
 */
export interface ISupportTicket extends Document {
  user: mongoose.Schema.Types.ObjectId;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  contactEmail: string;
  messages: TicketMessage[];
  assignedTo?: mongoose.Schema.Types.ObjectId;
  lastUpdated: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      trim: true,
      maxlength: [100, 'Subject cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open'
    },
    contactEmail: {
      type: String,
      required: [true, 'Please add a contact email'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ['user', 'support'],
          required: true
        },
        message: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Update lastUpdated when ticket is modified
SupportTicketSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Create indexes for common queries
SupportTicketSchema.index({ user: 1, status: 1 }); // User's active tickets
SupportTicketSchema.index({ status: 1, priority: 1 }); // Priority tickets by status
SupportTicketSchema.index({ assignedTo: 1, status: 1 }); // Assigned tickets

export default mongoose.model<ISupportTicket>(
  'SupportTicket',
  SupportTicketSchema
); 