# Backend API Documentation

## `/rides/create` Endpoint

### Description

Creates a new ride request for an authenticated user. Calculates or uses provided fare and stores the ride request in the database. Optionally returns a one-time OTP when a ride is created.

---

### HTTP Method

`POST`

---

### Authentication

JWT Token Required

---

### Request Body

The request body should be in JSON format and include the following fields:

- **pickup** _(string, required)_: Pickup address.
- **destination** _(string, required)_: Destination address.
- **vehicleType** _(string, required)_: Vehicle type; one of `auto`, `car`, `motorcycle`.

#### Example Request

```json
{
  "pickup": "1600 Amphitheatre Parkway, Mountain View, CA",
  "destination": "1 Infinite Loop, Cupertino, CA",
  "vehicleType": "car"
}
```

---

### Example Response

```json
{
  "ride": {
    "_id": "60f7b2c3a2b1c4567890d123",
    "user": "60f7b1a2a2b1c4567890d122",
    "pickup": "1600 Amphitheatre Parkway, Mountain View, CA",
    "destination": "1 Infinite Loop, Cupertino, CA",
    "fare": 45.5,
    "status": "pending"
  },
  "otp": "123456"
}
```

---

### Error Responses

#### 400 Bad Request

Returned when required fields are missing or invalid.

```json
{ "errors": [{ "msg": "Pickup is required" }] }
```

#### 401 Unauthorized

Returned when the JWT token is missing or invalid.

```json
{ "message": "Unauthorized" }
```

---

### Status Codes

- **201 Created** – Ride created successfully (sometimes returns 200 depending on implementation).
- **400 Bad Request** – Validation failed.
- **401 Unauthorized** – Missing or invalid JWT token.
- **500 Internal Server Error** – An unexpected error occurred.

---

## `/rides/get-fare` Endpoint

### Description

Returns estimated fares for supported vehicle types between two addresses. Accepts origin and destination query parameters and optionally a `vehicleType` to return a selected fare summary.

---

### HTTP Method

`GET`

---

### Authentication

JWT Token Required

---

### Query Parameters

- **origin** _(string, required)_: Pickup address.
- **destination** _(string, required)_: Destination address.
- **vehicleType** _(string, optional)_: If provided (`auto`|`car`|`motorcycle`), the response includes a `selected` summary.

#### Example Request

GET /rides/get-fare?origin=Times+Square&destination=Central+Park&vehicleType=car

---

### Example Response

```json
{
  "distance": 3.45,
  "distanceUnit": "km",
  "duration": 12.5,
  "durationUnit": "minutes",
  "fares": {
    "auto": { "estimatedFare": 40.0 },
    "car": { "estimatedFare": 55.0 },
    "motorcycle": { "estimatedFare": 30.0 }
  },
  "car": 55.0,
  "selected": { "vehicle": "car", "estimatedFare": 55.0 }
}
```

---

### Error Responses

#### 400 Bad Request

Returned when required query parameters are missing or invalid.

```json
{ "errors": [{ "msg": "Origin is required" }] }
```

#### 401 Unauthorized

Returned when the JWT token is missing or invalid.

```json
{ "message": "Unauthorized" }
```

---

### Status Codes

- **200 OK** – Fare estimates returned.
- **400 Bad Request** – Validation failed.
- **401 Unauthorized** – Missing or invalid JWT token.
- **500 Internal Server Error** – An unexpected error occurred while calculating fares.
