# Movie Booking Frontend

A clean React frontend for the Movie Booking System.

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features

- **Authentication**: Login/Signup with JWT tokens
- **Movie Booking Flow**: 
  - Select Cinema → Screen → Movie → Show Time → Seats
  - Visual seat selection with 10x10 grid
  - Maximum 6 seats per booking
- **Booking Management**: View and cancel bookings
- **Responsive Design**: Clean, modern UI

## API Integration

The frontend connects to the FastAPI backend running on `http://localhost:8000` via proxy configuration in `vite.config.js`.

## Key Components

- `AuthContext`: Manages user authentication state
- `SeatGrid`: Interactive seat selection component
- `Booking`: Multi-step booking flow
- `MyBookings`: Booking management interface

## Styling

Uses clean CSS with utility classes for consistent styling across components.
