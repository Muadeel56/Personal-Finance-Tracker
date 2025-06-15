# Contributing to Personal Finance Tracker

Thank you for your interest in contributing to Personal Finance Tracker! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project.

## How to Contribute

1. Fork the repository
2. Create a new branch for your feature/fix
3. Make your changes
4. Write/update tests if necessary
5. Update documentation
6. Submit a pull request

## Development Setup

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

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md with your changes
3. The PR will be merged once you have the sign-off of at least one other developer

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## Testing

- Frontend: Run tests with `npm test`
- Backend: Run tests with `python manage.py test`

## Documentation

- Keep documentation up to date
- Use clear and concise language
- Include examples where appropriate

## Best Practices

### Commit Messages
- Use [Conventional Commits](https://www.conventionalcommits.org/) for clear, consistent commit history.
- Structure: `type(scope): description`
- Examples:
  - `feat(api): add endpoint for recurring transactions`
  - `fix(frontend): resolve login redirect bug`
  - `docs: update README with setup instructions`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep messages concise but descriptive.

### Versioning
- Follow [Semantic Versioning](https://semver.org/): MAJOR.MINOR.PATCH
- Update [CHANGELOG.md](CHANGELOG.md) for every release and significant change.
- Example: Bumping from `1.0.0` to `1.1.0` for new features, or `1.0.1` for bug fixes.

### Issues & Pull Requests
- Use Issues to report bugs, request features, or ask questions.
- Apply relevant labels (e.g., `bug`, `enhancement`, `frontend`, `backend`, `priority:high`).
- Assign issues to milestones and project boards for better tracking.
- Reference related issues in PRs using `Fixes #issue_number` or `Closes #issue_number`.
- Ensure PRs are reviewed before merging.

### Milestones, Labels, and Project Boards
- **Milestones:** Group issues/PRs by release or sprint goals.
- **Labels:** Categorize and prioritize issues/PRs.
- **Project Boards:** Visualize workflow (e.g., To Do, In Progress, Done).

### Changelog
- Add a new entry in [CHANGELOG.md](CHANGELOG.md) for each significant change.
- Use clear, concise language and group changes by type (Added, Changed, Fixed, etc.).

## Questions?

Feel free to open an issue for any questions or concerns. 