# Budgets

## Budgets

### List Budgets
- **GET** `/budgets/budgets/`
- List all budgets for the authenticated user.
- **Auth:** Required

### Create Budget
- **POST** `/budgets/budgets/`
- **Request:**
```json
{
  "name": "Monthly Groceries",
  "amount": 400.00,
  "start_date": "2024-06-01",
  "end_date": "2024-06-30"
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "Monthly Groceries",
  "amount": 400.00,
  "start_date": "2024-06-01",
  "end_date": "2024-06-30"
}
```
- **Auth:** Required

### Get/Update/Delete Budget
- **GET** `/budgets/budgets/{id}/`
- **PUT/PATCH** `/budgets/budgets/{id}/`
- **DELETE** `/budgets/budgets/{id}/`
- **Auth:** Required

---

## Budget Categories

### List Budget Categories
- **GET** `/budgets/budget-categories/`
- List all budget categories.
- **Auth:** Required

### Create Budget Category
- **POST** `/budgets/budget-categories/`
- **Request:**
```json
{
  "budget": 1,
  "category": 1
}
```
- **Response:**
```json
{
  "id": 1,
  "budget": 1,
  "category": 1
}
```
- **Auth:** Required

### Get/Update/Delete Budget Category
- **GET** `/budgets/budget-categories/{id}/`
- **PUT/PATCH** `/budgets/budget-categories/{id}/`
- **DELETE** `/budgets/budget-categories/{id}/`
- **Auth:** Required

---

## Budget Alerts

### List Budget Alerts
- **GET** `/budgets/budget-alerts/`
- List all budget alerts.
- **Auth:** Required

### Create Budget Alert
- **POST** `/budgets/budget-alerts/`
- **Request:**
```json
{
  "budget": 1,
  "threshold": 90,
  "alert_type": "email"
}
```
- **Response:**
```json
{
  "id": 1,
  "budget": 1,
  "threshold": 90,
  "alert_type": "email"
}
```
- **Auth:** Required

### Get/Update/Delete Budget Alert
- **GET** `/budgets/budget-alerts/{id}/`
- **PUT/PATCH** `/budgets/budget-alerts/{id}/`
- **DELETE** `/budgets/budget-alerts/{id}/`
- **Auth:** Required 