## Movie Booking API - Endpoints

Base URL: `/api`

### Auth
- POST `/auth/signup` → Create user
  - body: `{ name, email, password }`
  - 201 → `UserOut`
- POST `/auth/login` → Get access token (OAuth2 password)
  - form: `username=email`, `password`
  - 200 → `{ access_token, token_type }`
- GET `/auth/me` (Bearer) → Current user
  - 200 → `UserOut`

### Users
- GET `/users/me` (Bearer) → Current user
  - 200 → `UserOut`

### Cinemas
- GET `/cinemas/` → List cinemas → `CinemaOut[]`
- GET `/cinemas/{id}` → Cinema → `CinemaOut`
- POST `/cinemas/` (Admin) → Create cinema → `CinemaOut`
- PUT `/cinemas/{id}` (Admin) → Update cinema → `CinemaOut`
- DELETE `/cinemas/{id}` (Admin) → 204

### Screens
- GET `/screens/` → List screens → `ScreenOut[]`
- GET `/screens/{id}` → Screen → `ScreenOut`
- POST `/screens/` (Admin) → Create screen → `ScreenOut`
- PUT `/screens/{id}` (Admin) → Update screen → `ScreenOut`
- DELETE `/screens/{id}` (Admin) → 204

### Movies
- GET `/movies/` → List movies → `MovieOut[]`
- GET `/movies/{id}` → Movie → `MovieOut`
- POST `/movies/` (Admin) → Create movie → `MovieOut`
- PUT `/movies/{id}` (Admin) → Update movie → `MovieOut`
- DELETE `/movies/{id}` (Admin) → 204

### Shows
- GET `/shows/` → List shows → `ShowOut[]`
- GET `/shows/{id}` → Show → `ShowOut`
- POST `/shows/` (Admin) → Create show → `ShowOut`
- PUT `/shows/{id}` (Admin) → Update show → `ShowOut`
- DELETE `/shows/{id}` (Admin) → 204

### Bookings (Bearer)
- POST `/bookings/` → Create booking
  - body: `{ show_id, seats: [{row, col}] }` (1-6 seats)
  - 201 → `BookingOut`
- GET `/bookings/me` → List my bookings → `BookingOut[]`
- DELETE `/bookings/{booking_id}` → Cancel my booking → 204

### Notes
- Seat grid is 10x10 with zero-based `{row, col}`.
- Booking fails with 409 if any requested seat is already taken for the show.
- Use `Authorization: Bearer <token>` for protected endpoints.
