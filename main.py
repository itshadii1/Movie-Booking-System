from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

from app.routers import auth, users, cinemas, screens, movies, shows, bookings
from app.core.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(cinemas.router, prefix="/api/cinemas", tags=["cinemas"])
app.include_router(screens.router, prefix="/api/screens", tags=["screens"])
app.include_router(movies.router, prefix="/api/movies", tags=["movies"])
app.include_router(shows.router, prefix="/api/shows", tags=["shows"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

