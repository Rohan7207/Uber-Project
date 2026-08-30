# Backend API Documentation

## `/maps/get-coordinates` Endpoint

### Description

Returns geographic coordinates (latitude and longitude) for a provided address using the geocoding service.

---

### HTTP Method

`GET`

---

### Authentication

JWT Token Required

---

### Query Parameters

- **address** _(string, required)_: The human-readable address to geocode.

#### Example Request

GET /maps/get-coordinates?address=1600+Amphitheatre+Parkway

---

### Example Response

```json
{
  "lat": 37.42202,
  "lng": -122.08408
}
```

---

### Error Responses

#### 400 Bad Request

Returned when the `address` query parameter is missing or invalid.

```json
{ "message": "Address query parameter is required" }
```

#### 404 Not Found

Returned when no coordinates could be found for the given address.

```json
{ "message": "Coordinates not found" }
```

---

### Status Codes

- **200 OK** – Coordinates returned.
- **400 Bad Request** – `address` missing or invalid.
- **404 Not Found** – No matching coordinates.
- **401 Unauthorized** – Missing or invalid JWT token.
- **500 Internal Server Error** – An unexpected error occurred while processing the request.

---

## `/maps/get-distance-time` Endpoint

### Description

Returns route distance (in kilometers) and estimated travel time (in minutes) between two addresses. Useful for fare calculations and ETAs.

---

### HTTP Method

`GET`

---

### Authentication

JWT Token Required

---

### Query Parameters

- **origin** _(string, required)_: Starting address.
- **destination** _(string, required)_: Ending address.

#### Example Request

GET /maps/get-distance-time?origin=Times+Square&destination=Central+Park

---

### Example Response

```json
{
  "distance": 3.45,
  "distanceUnit": "km",
  "duration": 12.5,
  "durationUnit": "minutes"
}
```

---

### Error Responses

#### 400 Bad Request

Returned when `origin` or `destination` is missing or invalid.

```json
{ "errors": [{ "msg": "Origin is required" }] }
```

#### 500 Internal Server Error

Returned when the routing service cannot compute a route.

```json
{ "message": "Internal server error" }
```

---

### Status Codes

- **200 OK** – Distance and duration returned.
- **400 Bad Request** – Validation failed.
- **401 Unauthorized** – Missing or invalid JWT token.
- **500 Internal Server Error** – Routing service failure.

---

## `/maps/get-suggestions` Endpoint

### Description

Returns autocomplete suggestions for a partial address input. Useful for building location search UIs.

---

### HTTP Method

`GET`

---

### Authentication

JWT Token Required

---

### Query Parameters

- **input** _(string, required)_: Partial address text to query suggestions for.

#### Example Request

GET /maps/get-suggestions?input=1600+Amph

---

### Example Response

```json
[
  {
    "place_id": "123456",
    "displayName": "1600 Amphitheatre Parkway, Mountain View, CA",
    "lat": 37.42202,
    "lon": -122.08408,
    "type": "address"
  },
  {
    "place_id": "654321",
    "displayName": "1600 Amphitheatre Lane, Somecity",
    "lat": 37.42,
    "lon": -122.08,
    "type": "address"
  }
]
```

---

### Error Responses

#### 400 Bad Request

Returned when `input` is missing or too short.

```json
{ "errors": [{ "msg": "Search query is required" }] }
```

#### 500 Internal Server Error

Returned when the autocomplete service fails.

```json
{ "message": "Internal server error" }
```

---

### Status Codes

- **200 OK** – Suggestions returned.
- **400 Bad Request** – Validation failed.
- **401 Unauthorized** – Missing or invalid JWT token.
- **500 Internal Server Error** – Autocomplete service failure.
