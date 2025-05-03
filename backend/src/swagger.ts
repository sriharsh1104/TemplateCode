import swaggerAutogen from 'swagger-autogen';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const doc = {
  info: {
    title: 'Settings API',
    description: 'API for managing user settings, security, notifications, and support',
    version: '1.0.0',
  },
  host: `localhost:${process.env.PORT || 5000}`,
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your bearer token in the format "Bearer {token}"',
    },
  },
  definitions: {
    User: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      role: 'user',
      profileImage: '/uploads/profile/user_123.jpg',
      phone: '+1234567890',
      username: 'johndoe',
      language: 'English',
      timezone: 'UTC+0 (GMT)',
      twoFactorEnabled: false,
    },
    LoginRequest: {
      email: 'johndoe@example.com',
      password: 'password123',
    },
    RegisterRequest: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    },
    AccountSettings: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '+1234567890',
      username: 'johndoe',
      language: 'English',
      timezone: 'UTC+0 (GMT)',
      profileImage: '/uploads/profile/user_123.jpg',
    },
    SecuritySettings: {
      twoFactorEnabled: false,
      recoveryEmail: 'recovery@example.com',
    },
    NotificationSettings: {
      channels: {
        email: true,
        push: true,
        sms: false,
      },
      preferences: {
        account: {
          email: true,
          push: true,
          sms: false,
        },
        activity: {
          email: true,
          push: true,
          sms: false,
        },
        updates: {
          email: true,
          push: false,
          sms: false,
        },
        marketing: {
          email: false,
          push: false,
          sms: false,
        },
      },
      digestFrequency: 'daily',
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '07:00',
      },
    },
    SupportTicket: {
      subject: 'Issue with account',
      description: 'I am having trouble accessing my account',
      priority: 'medium',
      status: 'open',
      contactEmail: 'johndoe@example.com',
      messages: [
        {
          sender: 'user',
          message: 'I am having trouble accessing my account',
          timestamp: '2023-05-01T10:00:00Z',
        },
      ],
    },
    ErrorResponse: {
      success: false,
      error: 'Error message',
    },
  },
};

const outputFile = path.join(__dirname, '../swagger-output.json');
const endpointsFiles = [
  path.join(__dirname, './routes/authRoutes.ts'),
  path.join(__dirname, './routes/userRoutes.ts'),
  path.join(__dirname, './routes/settingsRoutes.ts'),
  path.join(__dirname, './routes/notificationRoutes.ts'),
  path.join(__dirname, './routes/supportRoutes.ts'),
];

// Generate Swagger documentation
swaggerAutogen()(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log('Swagger documentation generated successfully');
  })
  .catch((err) => {
    console.error('Error generating Swagger documentation:', err);
  }); 