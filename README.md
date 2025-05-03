# Full-Stack Application Template

This project is a full-stack application with a React frontend and Express backend. It includes authentication, user management, settings, notifications, and support ticket functionalities.

## Features

### Frontend
- Complete authentication flow (Sign In, Sign Up, Forgot Password, Reset Password)
- Dashboard layout with Header, Sidebar, and Footer
- Profile page with edit functionality
- Dark/Light mode theme toggle
- Responsive design
- Reusable UI components (Custom Inputs, Custom Selects, etc.)
- SCSS styling with component-specific stylesheets

### Backend
- Express.js server with TypeScript
- MongoDB integration with Mongoose
- JWT authentication
- User management
- Notification settings
- Support ticket system
- RESTful API endpoints
- WebSocket support with Socket.IO

## Technologies Used

### Frontend
- React 19
- TypeScript
- Vite
- React Router v6
- Redux Toolkit for state management
- React Query for API data fetching
- Socket.IO client for real-time communication
- SCSS for styling
- Material UI Icons

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Socket.IO for real-time communication
- Morgan for logging
- Helmet for security

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fullstack-template
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
   - Create a `.env` file in the backend directory based on `.env.example`

4. Start the development servers:
```bash
npm run dev
```

5. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`
   - API docs: `http://localhost:5000/api-docs`

## Project Structure

```
/
├── frontend/            # React frontend application
│   ├── src/             # Source code
│   │   ├── assets/      # Static assets
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── styles/      # Global styles
│   │   └── utils/       # Utility functions
│   ├── public/          # Public assets
│   └── docs/            # Documentation
├── backend/             # Express backend application
│   ├── src/             # Source code
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   └── utils/       # Utility functions
│   └── uploads/         # File uploads directory
└── package.json         # Root package.json with workspace config
```

## Available Scripts

- `npm run dev` - Start both frontend and backend servers
- `npm run start:frontend` - Start only the frontend server
- `npm run start:backend` - Start only the backend server
- `npm run build` - Build the frontend for production
- `npm run install:all` - Install dependencies for all packages

## Documentation

- API documentation is available at `/api-docs` when the backend is running
- WebSocket usage documentation is available in the `frontend/docs` directory

## License

MIT
