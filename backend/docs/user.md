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

---

# `/users/login` Endpoint

### Description

Authenticates an existing user by verifying the provided email and password. If the credentials are valid, a JWT authentication token is generated and returned along with the user details.

---

### HTTP Method

`POST`

---

### Authentication

No authentication required.

---

### Request Body

The request body should be in JSON format and include the following fields:

- **email** _(string, required)_: User's email address (must be a valid email).
- **password** _(string, required)_: User's password (minimum 6 characters).

#### Example Request

```json
{
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

### Error Responses

#### 400 Bad Request

Returned when request validation fails.

```json
{
  "errors": [
    {
      "msg": "Invalid email"
    }
  ]
}
```

#### 401 Unauthorized

Returned when the email does not exist or the password is incorrect.

```json
{
  "message": "Invalid email or password"
}
```

---

### Status Codes

- **200 OK** – User logged in successfully.
- **400 Bad Request** – Validation failed.
- **401 Unauthorized** – Invalid email or password.
- **500 Internal Server Error** – An unexpected error occurred while processing the request.

---

### Validation Rules

- **email** must be a valid email address.
- **password** must contain at least **6** characters.
