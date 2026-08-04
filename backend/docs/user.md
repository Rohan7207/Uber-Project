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

---

# `/users/profile` Endpoint

### Description

Retrieves the profile information of the currently authenticated user. This endpoint can only be accessed by users with a valid JWT authentication token.

---

### HTTP Method

`GET`

---

### Authentication

JWT Token Required

---

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

---

### Example Response

```json
{
  "_id": "6892f1e5d7b8c123456789ab",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "socketId": null
}
```

---

### Error Responses

#### 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

---

### Status Codes

- **200 OK** – User profile retrieved successfully.
- **401 Unauthorized** – Invalid, expired, missing, or blacklisted JWT token.
- **500 Internal Server Error** – An unexpected error occurred while processing the request.

---

# `/users/logout` Endpoint

### Description

Logs out the currently authenticated user by clearing the authentication cookie and adding the JWT token to the blacklist. Any blacklisted token cannot be used to access protected routes again.

---

### HTTP Method

`GET`

---

### Authentication

JWT Token Required

---

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

---

### Success Response

```json
{
  "message": "Logged out"
}
```

---

### Error Responses

#### 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

---

### Status Codes

- **200 OK** – User logged out successfully.
- **401 Unauthorized** – Invalid, expired, missing, or blacklisted JWT token.
- **500 Internal Server Error** – An unexpected error occurred while processing the request.
