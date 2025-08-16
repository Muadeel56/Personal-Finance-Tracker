# Personal Finance Tracker

A full-stack web application for tracking personal finances, built with React and Django.

## Project Overview

This project consists of two main parts:
- Frontend: A modern React application with a beautiful UI
- Backend: A Django REST Framework API

## Project Structure

```
personal-finance-tracker/
├── frontend/          # React application
├── backend/           # Django application
├── docs/             # Project documentation
│   ├── features/     # Feature documentation
│   ├── development/  # Development docs
│   └── deployment/   # Deployment docs
├── scripts/          # Utility scripts and tests
├── .github/          # GitHub workflows and templates
├── README.md         # Main project README
└── .gitignore        # Git ignore rules
```

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

- [Project Documentation](docs/README.md)
- [Frontend Documentation](frontend/finance-frontend/README.md)
- [Backend Documentation](backend/README.md)
- [Scripts and Utilities](scripts/README.md)

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

See [CONTRIBUTING.md](docs/deployment/CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## GitHub Workflow & Collaboration

This project follows best practices for open-source collaboration:

- **Issues:** Use GitHub Issues to report bugs, request features, or ask questions. Apply appropriate labels (e.g., `bug`, `enhancement`, `documentation`, `frontend`, `backend`, `priority:high`, etc.) to help organize and prioritize work.
- **Labels:** Labels help categorize issues and pull requests. See the Issues tab for available labels.
- **Milestones:** Milestones group issues and pull requests by project goals or releases (e.g., `v1.0.0`, `Documentation Sprint`). Assign issues to milestones to track progress.
- **Project Boards:** Use GitHub Projects to visualize and manage tasks. Boards like "Current Sprint" or "Bug Tracking" help organize work into columns (To Do, In Progress, Review, Done).

## Commit Message Convention

We use the [Conventional Commits](https://www.conventionalcommits.org/) standard to make commit history readable and automate changelog generation. Example:

```
feat(frontend): add dark mode toggle
fix(backend): correct budget calculation bug
docs: update API usage in README
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## Versioning & Changelog

This project uses [Semantic Versioning](https://semver.org/):
- **MAJOR** version when you make incompatible API changes
- **MINOR** version when you add functionality in a backwards-compatible manner
- **PATCH** version when you make backwards-compatible bug fixes

All changes are tracked in [CHANGELOG.md](docs/deployment/CHANGELOG.md). Update the changelog for every significant change.

## How to Contribute

See [CONTRIBUTING.md](docs/deployment/CONTRIBUTING.md) for detailed guidelines on contributing, including development setup, commit conventions, and pull request process. 