# Backend API Documentation

## `/users/registerUser` Endpoint

### Description

Registers a new user by creating a user account with the provided information.

---

### HTTP Method

`POST`

---

### Authentication

No authentication required.

---

### Request Body

The request body should be in JSON format and include the following fields:

- **fullname** _(object)_
  - **firstname** _(string, required)_: User's first name (minimum 3 characters).
  - **lastname** _(string, optional)_: User's last name (minimum 3 characters).
- **email** _(string, required)_: User's email address (must be a valid email).
- **password** _(string, required)_: User's password (minimum 6 characters).

#### Example Request

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Example Response

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "_id": "6892f1e5d7b8c123456789ab",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

---

### Status Codes

- **201 Created** – User registered successfully.
- **400 Bad Request** – Validation failed or request body is invalid.
- **409 Conflict** – User with the given email already exists.
- **500 Internal Server Error** – An unexpected error occurred while processing the request.

---

### Validation Rules

- **firstname** must contain at least **3** characters.
- **lastname** should contain at least **3** characters if provided.
- **email** must be a valid email address.
- **password** must contain at least **6** characters.
