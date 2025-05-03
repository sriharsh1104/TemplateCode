import mongoose, { Document, Schema } from 'mongoose';

/**
 * ChannelPreference document interface
 */
interface ChannelPreference {
  email: boolean;
  push: boolean;
  sms: boolean;
}

/**
 * QuietHours document interface
 */
interface QuietHours {
  enabled: boolean;
  start: string;
  end: string;
}

/**
 * NotificationSetting document interface
 */
export interface INotificationSetting extends Document {
  user: mongoose.Schema.Types.ObjectId;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  preferences: {
    account: ChannelPreference;
    activity: ChannelPreference;
    updates: ChannelPreference;
    marketing: ChannelPreference;
  };
  digestFrequency: 'daily' | 'weekly' | 'never';
  quietHours: QuietHours;
}

const NotificationSettingSchema = new Schema<INotificationSetting>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    channels: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    preferences: {
      account: {
        email: {
          type: Boolean,
          default: true
        },
        push: {
          type: Boolean,
          default: true
        },
        sms: {
          type: Boolean,
          default: true
        }
      },
      activity: {
        email: {
          type: Boolean,
          default: true
        },
        push: {
          type: Boolean,
          default: true
        },
        sms: {
          type: Boolean,
          default: false
        }
      },
      updates: {
        email: {
          type: Boolean,
          default: true
        },
        push: {
          type: Boolean,
          default: false
        },
        sms: {
          type: Boolean,
          default: false
        }
      },
      marketing: {
        email: {
          type: Boolean,
          default: false
        },
        push: {
          type: Boolean,
          default: false
        },
        sms: {
          type: Boolean,
          default: false
        }
      }
    },
    digestFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'never'],
      default: 'daily'
    },
    quietHours: {
      enabled: {
        type: Boolean,
        default: false
      },
      start: {
        type: String,
        default: '22:00'
      },
      end: {
        type: String,
        default: '07:00'
      }
    }
  },
  {
    timestamps: true
  }
);

// Create index on user field
NotificationSettingSchema.index({ user: 1 });

export default mongoose.model<INotificationSetting>(
  'NotificationSetting',
  NotificationSettingSchema
); 