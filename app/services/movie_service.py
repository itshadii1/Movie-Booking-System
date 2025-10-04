from sqlalchemy.orm import Session

from app.models.models import Movie


def list_movies(db: Session) -> list[Movie]:
    return db.query(Movie).all()


def get_movie(db: Session, movie_id: int) -> Movie | None:
    return db.get(Movie, movie_id)


def create_movie(db: Session, title: str, description: str, duration: int) -> Movie:
    movie = Movie(title=title, description=description, duration=duration)
    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie


def update_movie(db: Session, movie: Movie, title: str | None, description: str | None, duration: int | None) -> Movie:
    if title is not None:
        movie.title = title
    if description is not None:
        movie.description = description
    if duration is not None:
        movie.duration = duration
    db.commit()
    db.refresh(movie)
    return movie


def delete_movie(db: Session, movie: Movie) -> None:
    db.delete(movie)
    db.commit()
