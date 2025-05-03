import mongoose, { Document, Schema } from 'mongoose';

/**
 * UserSession document interface
 */
export interface IUserSession extends Document {
  user: mongoose.Schema.Types.ObjectId;
  token: string;
  deviceInfo: {
    deviceType: 'desktop' | 'mobile' | 'tablet' | 'other';
    browser: string;
    os: string;
    ip: string;
    location?: string;
  };
  lastActive: Date;
  expiresAt: Date;
  isActive: boolean;
}

const UserSessionSchema = new Schema<IUserSession>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: {
      type: String,
      required: true
    },
    deviceInfo: {
      deviceType: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet', 'other'],
        default: 'other'
      },
      browser: {
        type: String,
        required: true
      },
      os: {
        type: String,
        required: true
      },
      ip: {
        type: String,
        required: true
      },
      location: {
        type: String
      }
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create index on token for quick lookups
UserSessionSchema.index({ token: 1 });

// Create index on user and isActive to find all active sessions for a user
UserSessionSchema.index({ user: 1, isActive: 1 });

// Create index on expiresAt to easily clean up expired sessions
UserSessionSchema.index({ expiresAt: 1 });

// Create TTL index to automatically remove expired documents
UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IUserSession>('UserSession', UserSessionSchema); 