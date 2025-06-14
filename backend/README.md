# Personal Finance Tracker - Backend

A Django-based backend for the Personal Finance Tracker application. Built with Django REST Framework.

## Features

- 🔒 JWT Authentication
- 👤 User management
- 💰 Transaction management
- 📈 Budget tracking
- 📊 Financial reports
- 🔄 RESTful API
- 📝 API documentation with Swagger/OpenAPI

## Tech Stack

- Python 3.8+
- Django 4.2+
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Celery (for async tasks)
- Redis (for caching)

## Prerequisites

- Python 3.8 or higher
- PostgreSQL
- Redis (optional, for caching)
- Virtual environment (recommended)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-tracker/backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/finance_tracker
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Start the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api`

## Project Structure

```
backend/
├── finance_tracker/    # Main project directory
│   ├── settings/      # Django settings
│   ├── urls.py        # URL configuration
│   └── wsgi.py        # WSGI configuration
├── apps/              # Django applications
│   ├── users/         # User management
│   ├── transactions/  # Transaction management
│   ├── budgets/       # Budget management
│   └── reports/       # Financial reports
├── core/              # Core functionality
├── utils/             # Utility functions
└── manage.py          # Django management script
```

## API Documentation

The API documentation is available at:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`

## Available Commands

- `python manage.py runserver` - Start development server
- `python manage.py test` - Run tests
- `python manage.py makemigrations` - Create migrations
- `python manage.py migrate` - Apply migrations
- `python manage.py createsuperuser` - Create admin user
- `python manage.py collectstatic` - Collect static files

## Testing

Run the test suite:
```bash
python manage.py test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 