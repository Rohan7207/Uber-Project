# Backend API Documentation

## `/captains/register` Endpoint

### Description

Registers a new captain by creating a captain account with the provided personal and vehicle information. On successful registration, a JWT authentication token is generated, stored in an HTTP cookie, and the captain details are returned.

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
  - **firstname** _(string, required)_: Captain's first name (minimum 3 characters).
  - **lastname** _(string, optional)_: Captain's last name (minimum 3 characters).
- **email** _(string, required)_: Captain's email address (must be unique and valid).
- **password** _(string, required)_: Password (minimum 6 characters).
- **vehicle** _(object, required)_
  - **color** _(string, required)_: Vehicle color (minimum 3 characters).
  - **plate** _(string, required)_: Vehicle registration number (minimum 3 characters).
  - **capacity** _(number, required)_: Number of passengers the vehicle can accommodate.
  - **vehicleType** _(string, required)_: Must be one of:
    - `car`
    - `motorcycle`
    - `auto`

#### Example Request

```json
{
  "fullname": {
    "firstname": "Rahul",
    "lastname": "Sharma"
  },
  "email": "rahul@example.com",
  "password": "password123",
  "vehicle": {
    "color": "White",
    "plate": "KA01AB1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

---

### Example Response

```json
{
  "captain": {
    "_id": "6892f1e5d7b8c123456789ab",
    "fullname": {
      "firstname": "Rahul",
      "lastname": "Sharma"
    },
    "email": "rahul@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "White",
      "plate": "KA01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

---

### Error Responses

#### 400 Bad Request

Returned when validation fails or the captain already exists.

```json
{
  "message": "Captain already exists"
}
```

or

```json
{
  "errors": [
    {
      "msg": "Invalid Email"
    }
  ]
}
```

---

### Status Codes

- **201 Created** – Captain registered successfully.
- **400 Bad Request** – Validation failed or captain already exists.
- **500 Internal Server Error** – An unexpected error occurred while processing the request.

---

### Validation Rules

- **firstname** must contain at least **3** characters.
- **lastname** should contain at least **3** characters if provided.
- **email** must be a valid email address.
- **password** must contain at least **6** characters.
- **vehicle.color** must contain at least **3** characters.
- **vehicle.plate** must contain at least **3** characters.
- **vehicle.capacity** must be at least **1**.
- **vehicle.vehicleType** must be one of **car**, **motorcycle**, or **auto**.
