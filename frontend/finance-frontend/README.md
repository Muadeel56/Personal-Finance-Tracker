# Personal Finance Tracker - Frontend

A modern React-based frontend for the Personal Finance Tracker application. Built with React, Vite, and Tailwind CSS.

## Features

- 🎨 Modern and responsive UI with Tailwind CSS
- 🌓 Dark/Light mode support
- 🔒 Authentication system
- 📊 Dashboard with financial overview
- 💰 Transaction management
- 📈 Budget tracking
- 📊 Financial reports
- 👤 User profile management
- ⚙️ Application settings

## Tech Stack

- React 18
- Vite
- React Router v6
- Tailwind CSS
- React Hot Toast
- Context API for state management

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-tracker/frontend/finance-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8000/api
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── common/        # Common UI components
│   └── layout/        # Layout components
├── contexts/          # React contexts
├── pages/            # Page components
├── services/         # API services
├── utils/            # Utility functions
└── App.jsx           # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Authentication

The application uses a mock authentication system for development. You can log in with any email and password combination.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
