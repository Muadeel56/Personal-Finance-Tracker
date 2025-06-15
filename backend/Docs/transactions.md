# Transactions

## Accounts

### List Accounts
- **GET** `/transactions/accounts/`
- List all accounts for the authenticated user.
- **Auth:** Required

### Create Account
- **POST** `/transactions/accounts/`
- Create a new account.
- **Request:**
```json
{
  "name": "Checking",
  "balance": 1000.00,
  "type": "bank"
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "Checking",
  "balance": 1000.00,
  "type": "bank",
  "created_at": "2024-06-01T12:00:00Z"
}
```
- **Auth:** Required

### Get/Update/Delete Account
- **GET** `/transactions/accounts/{id}/`
- **PUT/PATCH** `/transactions/accounts/{id}/`
- **DELETE** `/transactions/accounts/{id}/`
- **Auth:** Required

---

## Categories

### List Categories
- **GET** `/transactions/categories/`
- List all categories.
- **Auth:** Required

### Create Category
- **POST** `/transactions/categories/`
- **Request:**
```json
{
  "name": "Groceries",
  "type": "expense"
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "Groceries",
  "type": "expense"
}
```
- **Auth:** Required

### Get/Update/Delete Category
- **GET** `/transactions/categories/{id}/`
- **PUT/PATCH** `/transactions/categories/{id}/`
- **DELETE** `/transactions/categories/{id}/`
- **Auth:** Required

---

## Transactions

### List Transactions
- **GET** `/transactions/transactions/`
- List all transactions for the authenticated user.
- **Auth:** Required

### Create Transaction
- **POST** `/transactions/transactions/`
- **Request:**
```json
{
  "account": 1,
  "category": 1,
  "amount": 50.00,
  "date": "2024-06-01",
  "description": "Weekly groceries"
}
```
- **Response:**
```json
{
  "id": 1,
  "account": 1,
  "category": 1,
  "amount": 50.00,
  "date": "2024-06-01",
  "description": "Weekly groceries"
}
```
- **Auth:** Required

### Get/Update/Delete Transaction
- **GET** `/transactions/transactions/{id}/`
- **PUT/PATCH** `/transactions/transactions/{id}/`
- **DELETE** `/transactions/transactions/{id}/`
- **Auth:** Required 