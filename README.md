# React + TypeScript + Vite Template

This project is a modern React application template using TypeScript and Vite. It includes authentication pages (SignIn, SignUp, ForgotPassword, ResetPassword) and a dashboard layout with responsive design.

## Features

- Complete authentication flow (Sign In, Sign Up, Forgot Password, Reset Password)
- Dashboard layout with Header, Sidebar, and Footer
- Profile page with edit functionality
- Dark/Light mode theme toggle
- Responsive design
- Reusable UI components (Custom Inputs, Custom Selects, etc.)
- SCSS styling with component-specific stylesheets

## Technologies Used

- React 19
- TypeScript
- Vite
- React Router v6
- SCSS for styling
- Material UI Icons

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tempalatecode
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit: `http://localhost:5173`

## Project Structure

```
src/
├── assets/             # Static assets
├── components/
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── styles/             # Global styles and variables
└── utils/              # Utility functions
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally

## Customization

- Colors and theme variables can be modified in `src/styles/variables.scss`
- Global styles can be updated in `src/styles/global.scss`

## License

MIT
