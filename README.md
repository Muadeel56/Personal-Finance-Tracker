# Personal Finance Tracker

A full-stack web application for tracking personal finances, built with React and Django.

## Project Overview

This project consists of two main parts:
- Frontend: A modern React application with a beautiful UI
- Backend: A Django REST Framework API

## Quick Start

### Frontend
```bash
cd frontend/finance-frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Documentation

- [Frontend Documentation](frontend/finance-frontend/README.md)
- [Backend Documentation](backend/README.md)

## Features

- 💰 Track income and expenses
- 📊 Visualize financial data
- 📈 Set and monitor budgets
- 📱 Responsive design
- 🌓 Dark/Light mode
- 🔒 Secure authentication
- 📊 Financial reports and analytics

## Tech Stack

### Frontend
- React 18
- Vite
- React Router v6
- Tailwind CSS
- React Hot Toast
- Context API

### Backend
- Python 3.8+
- Django 4.2+
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Celery
- Redis

## Development

1. Clone the repository
2. Set up the frontend and backend as described in their respective README files
3. Create necessary environment files
4. Start both servers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 