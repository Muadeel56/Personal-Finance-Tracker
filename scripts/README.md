# Scripts

This directory contains utility scripts, test files, and debugging tools for the Personal Finance Tracker project.

## Script Categories

### Test Scripts
- `test_budget_flow.py` - Tests for budget flow functionality
- `test_date_fix.py` - Date parsing and fixing tests
- `test_final_date_fix.py` - Final date fixing tests
- `test_user_data.py` - User data testing scripts
- `test_date_parsing.js` - JavaScript date parsing tests

### Debug Scripts
- `debug_budget_analysis.py` - Budget analysis debugging tools

### Fix Scripts
- `fix_user_data.py` - User data fixing utilities

## Usage

### Running Test Scripts
```bash
# Python test scripts
python scripts/test_budget_flow.py
python scripts/test_date_fix.py
python scripts/test_user_data.py

# JavaScript test scripts
node scripts/test_date_parsing.js
```

### Running Debug Scripts
```bash
python scripts/debug_budget_analysis.py
```

### Running Fix Scripts
```bash
python scripts/fix_user_data.py
```

## Script Development Guidelines

1. **Documentation**: Each script should have clear documentation at the top
2. **Error Handling**: Include proper error handling and logging
3. **Configuration**: Use environment variables for configuration
4. **Testing**: Test scripts should be idempotent and safe to run multiple times
5. **Logging**: Use appropriate logging levels for debugging information

## Adding New Scripts

When adding new scripts:
1. Use descriptive file names
2. Include a docstring explaining the purpose
3. Add to this README with usage instructions
4. Ensure the script is executable if needed
5. Test the script thoroughly before committing

## Environment Setup

Some scripts may require specific environment variables or database connections. Check the individual script documentation for requirements. 