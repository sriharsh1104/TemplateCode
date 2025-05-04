import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

/**
 * User document interface
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  profileImage?: string;
  phone?: string;
  username?: string;
  language: string;
  timezone: string;
  lastLogin?: Date;
  twoFactorEnabled: boolean;
  recoveryEmail?: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    profileImage: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      maxlength: [30, 'Username cannot be more than 30 characters']
    },
    language: {
      type: String,
      default: 'English'
    },
    timezone: {
      type: String,
      default: 'UTC+0 (GMT)'
    },
    lastLogin: {
      type: Date,
      default: null
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    recoveryEmail: {
      type: String,
      default: null,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid recovery email'
      ]
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  const payload = { id: this._id };
  const secret = process.env.JWT_SECRET || 'default_jwt_secret';
  
  // Handle expiresIn value with proper type casting
  const expireValue = process.env.JWT_EXPIRE || '7d';
  
  // Use type assertion to ensure TypeScript understands the types correctly
  return jwt.sign(
    payload, 
    secret as jwt.Secret, 
    { expiresIn: expireValue as jwt.SignOptions['expiresIn'] }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema); 