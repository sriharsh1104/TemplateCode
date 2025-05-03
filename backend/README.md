# Settings API Backend

This is the backend API for the User Settings Application. It provides endpoints for user authentication, account settings, security settings, notification preferences, and support tickets.

## Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Multer and Sharp for image uploads and processing
- Swagger for API documentation

## Features

- User authentication (register, login, logout)
- Session management (view active sessions, terminate sessions)
- Account settings (update profile, manage profile image)
- Security settings (password change, two-factor authentication, recovery email)
- Notification preferences (channels, preferences, digest frequency, quiet hours)
- Support system (FAQs, system status, ticketing)

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Middleware (auth, error handling)
├── models/          # MongoDB models
├── routes/          # API routes
├── utils/           # Utility functions
├── server.ts        # Server entry point
└── swagger.ts       # Swagger documentation generator
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/settings-app
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=5242880  # 5MB
```

### Running the Application

- Development mode: `npm run dev`
- Build: `npm run build`
- Production: `npm start`
- Generate Swagger docs: `npm run swagger-autogen`

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `GET /api/auth/sessions` - Get active sessions
- `DELETE /api/auth/sessions/:id` - Terminate a session

### Account Settings
- `GET /api/settings/account` - Get account settings
- `PUT /api/settings/account` - Update account settings
- `POST /api/settings/account/profile-image` - Upload profile image
- `DELETE /api/settings/account/profile-image` - Delete profile image

### Security Settings
- `GET /api/settings/security` - Get security settings
- `PUT /api/settings/security` - Update security settings

### Notification Settings
- `GET /api/notifications/settings` - Get notification settings
- `PUT /api/notifications/settings/channels` - Update notification channels
- `PUT /api/notifications/settings/preferences/:type` - Update notification preferences
- `PUT /api/notifications/settings/digest` - Update digest frequency
- `PUT /api/notifications/settings/quiet-hours` - Update quiet hours

### Support
- `GET /api/support/faqs` - Get FAQs
- `GET /api/support/system-status` - Get system status
- `GET /api/support/tickets` - Get user's tickets
- `POST /api/support/tickets` - Create a ticket
- `GET /api/support/tickets/:id` - Get a specific ticket
- `POST /api/support/tickets/:id/messages` - Add a message to a ticket
- `PUT /api/support/tickets/:id/close` - Close a ticket 