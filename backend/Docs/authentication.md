# Authentication & User Management

## Register
- **POST** `/accounts/users/register/`
- Register a new user account.
- **Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "StrongPassword123!",
  "confirm_password": "StrongPassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "date_of_birth": "1990-01-01",
  "currency_preference": "USD",
  "timezone": "UTC"
}
```
- **Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "date_of_birth": "1990-01-01",
  "profile_picture": null,
  "currency_preference": "USD",
  "timezone": "UTC",
  "is_email_verified": false,
  "is_active": false,
  "settings": {...},
  "two_factor_enabled": false,
  "two_factor_method": "email"
}
```
- **Auth:** None
- **Notes:** User is inactive until email is verified.

---

## Login
- **POST** `/accounts/token/`
- Obtain JWT access and refresh tokens.
- **Request:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```
- **Response:**
```json
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token"
}
```
- **Auth:** None

---

## Refresh Token
- **POST** `/accounts/token/refresh/`
- Get a new access token using a refresh token.
- **Request:**
```json
{ "refresh": "jwt_refresh_token" }
```
- **Response:**
```json
{ "access": "new_jwt_access_token" }
```
- **Auth:** None

---

## Password Reset Request
- **POST** `/accounts/password-reset-request/`
- Request a password reset email.
- **Request:**
```json
{ "email": "user@example.com" }
```
- **Response:**
```json
{ "message": "Password reset email sent" }
```
- **Auth:** None

---

## Password Reset
- **POST** `/accounts/password-reset/`
- Reset password using token from email.
- **Request:**
```json
{
  "uid": "encoded_user_id",
  "token": "reset_token",
  "new_password": "NewStrongPassword123!",
  "confirm_password": "NewStrongPassword123!"
}
```
- **Response:**
```json
{ "message": "Password reset successful" }
```
- **Auth:** None

---

## Change Password
- **POST** `/accounts/change-password/`
- Change password for authenticated user.
- **Request:**
```json
{
  "old_password": "CurrentPassword123!",
  "new_password": "NewStrongPassword123!",
  "confirm_password": "NewStrongPassword123!"
}
```
- **Response:**
```json
{ "message": "Password changed successfully" }
```
- **Auth:** Required

---

## Email Verification
- **POST** `/accounts/verify-email/`
- Verify user email using token from email.
- **Request:**
```json
{
  "uid": "encoded_user_id",
  "token": "verification_token"
}
```
- **Response:**
```json
{
  "message": "Email verified successfully",
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token"
}
```
- **Auth:** None

---

## Get User Profile
- **GET** `/accounts/users/{id}/`
- Get user profile details.
- **Auth:** Required (user can only access their own profile)

---

## Update User Profile
- **PUT/PATCH** `/accounts/users/{id}/`
- Update user profile.
- **Auth:** Required

---

## Deactivate Account
- **POST** `/accounts/deactivate-account/`
- Deactivate the authenticated user's account.
- **Request:**
```json
{ "reason": "No longer needed" }
```
- **Response:**
```json
{ "message": "Account deactivated successfully" }
```
- **Auth:** Required

---

## Reactivate Account
- **POST** `/accounts/reactivate-account/`
- Reactivate the authenticated user's account.
- **Response:**
```json
{ "message": "Account reactivated successfully" }
```
- **Auth:** Required 