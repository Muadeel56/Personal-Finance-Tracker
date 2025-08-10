# Debt Management API Documentation

## Overview

The Debt Management API provides RESTful endpoints for managing debt transactions, including borrowing and lending money tracking. All endpoints require authentication and users can only access their own debt records.

## Base URL

```
/api/debts/
```

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. List Debt Transactions

**GET** `/api/debts/`

Lists all debt transactions for the authenticated user with pagination, filtering, and sorting support.

#### Query Parameters

- `page` (int): Page number (default: 1)
- `page_size` (int): Items per page (default: 20, max: 100)
- `ordering` (string): Sort by field. Prefix with `-` for descending order
  - Available fields: `due_date`, `amount`, `created_at`, `person_name`
  - Example: `-due_date` (due date descending)
- `search` (string): Search in person name, description, and contact info
- `transaction_type` (string): Filter by transaction type
  - Values: `NEED_TO_GIVE`, `NEED_TO_GET`
- `status` (string): Filter by status
  - Values: `UNPAID`, `PAID`, `OVERDUE`
- `person_name` (string): Filter by person name (case insensitive partial match)
- `due_date_from` (date): Filter debts due from this date (YYYY-MM-DD)
- `due_date_to` (date): Filter debts due until this date (YYYY-MM-DD)
- `created_at_from` (datetime): Filter debts created from this datetime
- `created_at_to` (datetime): Filter debts created until this datetime
- `amount_min` (decimal): Filter debts with minimum amount
- `amount_max` (decimal): Filter debts with maximum amount

#### Response

```json
{
  "count": 25,
  "next": "http://localhost:8000/api/debts/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "person_name": "John Doe",
      "amount": "100.00",
      "transaction_type": "NEED_TO_GIVE",
      "due_date": "2024-02-15",
      "status": "UNPAID",
      "status_display": "Unpaid",
      "days_until_due": 10,
      "is_overdue": false,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "summary": {
    "total_count": 25,
    "total_amount": 2500.00,
    "filtered_count": 20
  }
}
```

### 2. Create Debt Transaction

**POST** `/api/debts/`

Creates a new debt transaction.

#### Request Body

```json
{
  "person_name": "John Doe",
  "amount": "100.00",
  "transaction_type": "NEED_TO_GIVE",
  "date_created": "2024-01-15",
  "due_date": "2024-02-15",
  "description": "Borrowed money for lunch",
  "contact_info": "john@example.com"
}
```

#### Required Fields

- `person_name` (string): Name of the person involved
- `amount` (decimal): Amount of money (must be positive)
- `transaction_type` (string): `NEED_TO_GIVE` or `NEED_TO_GET`
- `date_created` (date): When the debt was incurred
- `due_date` (date): Expected payment/return date (cannot be in the past)

#### Optional Fields

- `description` (string): Additional details about the debt
- `contact_info` (string): Phone number or email

#### Response

```json
{
  "id": 1,
  "person_name": "John Doe",
  "amount": "100.00",
  "transaction_type": "NEED_TO_GIVE",
  "date_created": "2024-01-15",
  "due_date": "2024-02-15",
  "status": "UNPAID",
  "description": "Borrowed money for lunch",
  "contact_info": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "paid_date": null
}
```

### 3. Retrieve Debt Transaction

**GET** `/api/debts/{id}/`

Retrieves a specific debt transaction by ID.

#### Response

```json
{
  "id": 1,
  "user": 1,
  "person_name": "John Doe",
  "amount": "100.00",
  "transaction_type": "NEED_TO_GIVE",
  "date_created": "2024-01-15",
  "due_date": "2024-02-15",
  "status": "UNPAID",
  "status_display": "Unpaid",
  "description": "Borrowed money for lunch",
  "contact_info": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "paid_date": null,
  "days_until_due": 10,
  "days_overdue": 0,
  "is_overdue": false
}
```

### 4. Update Debt Transaction

**PUT** `/api/debts/{id}/`

Updates a debt transaction completely.

#### Request Body

```json
{
  "person_name": "John Doe Updated",
  "amount": "150.00",
  "due_date": "2024-03-15",
  "status": "UNPAID",
  "description": "Updated description",
  "contact_info": "john.updated@example.com"
}
```

**PATCH** `/api/debts/{id}/`

Partially updates a debt transaction.

#### Request Body

```json
{
  "status": "PAID"
}
```

### 5. Delete Debt Transaction

**DELETE** `/api/debts/{id}/`

Deletes a debt transaction.

#### Response

```json
{
  "detail": "Debt transaction for John Doe ($100.00) has been deleted successfully."
}
```

## Custom Actions

### 1. Mark Debt as Paid

**POST** `/api/debts/{id}/mark_paid/`

Marks a debt transaction as paid and sets the paid date.

#### Response

```json
{
  "detail": "Debt marked as paid successfully.",
  "debt": {
    "id": 1,
    "person_name": "John Doe",
    "amount": "100.00",
    "status": "PAID",
    "paid_date": "2024-01-15T15:30:00Z",
    ...
  }
}
```

#### Error Response (if already paid)

```json
{
  "detail": "Debt is already marked as paid."
}
```

### 2. Get Debt Statistics

**GET** `/api/debts/statistics/`

Returns comprehensive debt statistics for the authenticated user.

#### Response

```json
{
  "total_statistics": {
    "total_amount": 1500.00,
    "total_count": 10,
    "average_amount": 150.00
  },
  "by_transaction_type": {
    "need_to_give": {
      "total_amount": 800.00,
      "count": 5,
      "unpaid_amount": 600.00,
      "unpaid_count": 3
    },
    "need_to_get": {
      "total_amount": 700.00,
      "count": 5,
      "unpaid_amount": 400.00,
      "unpaid_count": 2
    }
  },
  "by_status": {
    "unpaid": {
      "count": 4,
      "total_amount": 800.00
    },
    "paid": {
      "count": 5,
      "total_amount": 600.00
    },
    "overdue": {
      "count": 1,
      "total_amount": 100.00
    }
  },
  "overdue": {
    "count": 1,
    "total_amount": 100.00
  }
}
```

### 3. Get Overdue Debts

**GET** `/api/debts/overdue/`

Returns paginated list of overdue debt transactions, sorted by due date (oldest first).

#### Response

```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "person_name": "John Doe",
      "amount": "100.00",
      "transaction_type": "NEED_TO_GIVE",
      "due_date": "2024-01-01",
      "status": "OVERDUE",
      "status_display": "Overdue",
      "days_until_due": -14,
      "is_overdue": true,
      "created_at": "2023-12-15T10:30:00Z"
    }
  ]
}
```

## Data Models

### DebtTransaction Fields

- `id` (int): Unique identifier
- `user` (int): User ID (automatically set, read-only)
- `person_name` (string): Name of the person involved
- `amount` (decimal): Amount of money
- `transaction_type` (string): `NEED_TO_GIVE` or `NEED_TO_GET`
- `date_created` (date): When the debt was incurred
- `due_date` (date): Expected payment/return date
- `status` (string): `UNPAID`, `PAID`, or `OVERDUE`
- `description` (string, optional): Additional details
- `contact_info` (string, optional): Phone number or email
- `created_at` (datetime): Record creation timestamp
- `updated_at` (datetime): Record update timestamp
- `paid_date` (datetime, optional): When marked as paid

### Computed Fields

- `status_display` (string): Human-readable status with automatic overdue detection
- `days_until_due` (int): Days until due date (negative if overdue)
- `days_overdue` (int): Days overdue (0 if not overdue)
- `is_overdue` (boolean): Whether the debt is overdue

## Error Responses

### Validation Errors (400 Bad Request)

```json
{
  "amount": ["Amount must be positive."],
  "due_date": ["Due date cannot be in the past."]
}
```

### Authentication Required (401 Unauthorized)

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Not Found (404 Not Found)

```json
{
  "detail": "Not found."
}
```

### Permission Denied (403 Forbidden)

```json
{
  "detail": "You do not have permission to perform this action."
}
```

## Usage Examples

### Create a debt where you owe money

```bash
curl -X POST "http://localhost:8000/api/debts/" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "person_name": "Alice Smith",
    "amount": "250.00",
    "transaction_type": "NEED_TO_GIVE",
    "date_created": "2024-01-15",
    "due_date": "2024-02-15",
    "description": "Borrowed for car repair",
    "contact_info": "alice@example.com"
  }'
```

### Create a debt where someone owes you

```bash
curl -X POST "http://localhost:8000/api/debts/" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "person_name": "Bob Wilson",
    "amount": "100.00",
    "transaction_type": "NEED_TO_GET",
    "date_created": "2024-01-15",
    "due_date": "2024-02-15",
    "description": "Lent for groceries"
  }'
```

### Filter overdue debts you owe

```bash
curl "http://localhost:8000/api/debts/overdue/?transaction_type=NEED_TO_GIVE" \
  -H "Authorization: Bearer <token>"
```

### Get statistics

```bash
curl "http://localhost:8000/api/debts/statistics/" \
  -H "Authorization: Bearer <token>"
```

### Mark debt as paid

```bash
curl -X POST "http://localhost:8000/api/debts/1/mark_paid/" \
  -H "Authorization: Bearer <token>"
```

## Notes

- All monetary amounts are returned as strings to preserve precision
- Dates are in ISO 8601 format (YYYY-MM-DD)
- Datetimes are in ISO 8601 format with timezone (YYYY-MM-DDTHH:MM:SSZ)
- The system automatically updates status to `OVERDUE` for unpaid debts past their due date
- When a debt is marked as paid, the `paid_date` is automatically set
- Users can only access their own debt records (data isolation)
- Pagination uses cursor-based pagination for better performance with large datasets 