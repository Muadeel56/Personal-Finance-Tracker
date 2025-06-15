# User Settings

## Get User Settings
- **GET** `/accounts/user-settings/`
- Get the authenticated user's settings.
- **Response:**
```json
{
  "id": 1,
  "user": 1,
  "theme": "light",
  "notification_preferences": { "email": true, "push": false },
  "language": "en",
  "created_at": "2024-06-01T12:00:00Z",
  "updated_at": "2024-06-01T12:00:00Z",
  "two_factor_enabled": false,
  "two_factor_method": "email",
  "session_timeout": 30,
  "login_notification": true
}
```
- **Auth:** Required

---

## Update User Settings
- **PUT/PATCH** `/accounts/user-settings/{id}/`
- Update user settings.
- **Request:**
```json
{
  "theme": "dark",
  "notification_preferences": { "email": true, "push": true },
  "language": "en",
  "two_factor_enabled": true,
  "two_factor_method": "email",
  "session_timeout": 60,
  "login_notification": true
}
```
- **Response:**
```json
{
  "id": 1,
  "user": 1,
  "theme": "dark",
  "notification_preferences": { "email": true, "push": true },
  "language": "en",
  "created_at": "2024-06-01T12:00:00Z",
  "updated_at": "2024-06-01T12:10:00Z",
  "two_factor_enabled": true,
  "two_factor_method": "email",
  "session_timeout": 60,
  "login_notification": true
}
```
- **Auth:** Required 