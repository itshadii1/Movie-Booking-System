Movie Booking System (FastAPI + React)

What this is
- A BookMyShow-style app: browse cinemas/shows, pick seats, and book.
- Bonus: admin panel to manage movies/cinemas/screens/shows and view seat ownership.

Tech stack
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Frontend: React (Vite), Axios

Quick start
1) Backend
   - python -m venv .venv && source .venv/bin/activate
   - pip install -r requirements.txt
   - uvicorn main:app --reload
2) Frontend
   - cd frontend
   - npm install
   - npm run dev

URLs
- API: http://localhost:8000 (docs at /docs)
- Frontend: http://localhost:3000
- Admin panel: http://localhost:3000/admin

Admin login
- Email: host@example.com
- Password: pass123

Core features
- Cinemas and shows listing
- Seat selection (fixed layout, limits to 6 seats)
- Booking confirmation and history

Admin features (bonus)
- CRUD for Movies, Cinemas, Screens, Shows
- Seat layout view with hover to see who booked a seat

Schema (brief)
- users(id, name, email, password, is_admin)
- cinemas(id, name, location)
- screens(id, cinema_id, name)
- movies(id, title, description, duration)
- shows(id, movie_id, screen_id, start_time)
- bookings(id, user_id, show_id, seat)

Notes
- Data is pre-seeded. You can add more via the admin panel.
- Seat map uses a fixed grid.

