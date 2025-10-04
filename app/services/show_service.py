from sqlalchemy.orm import Session

from app.models.models import Show


def list_shows(db: Session) -> list[Show]:
    return db.query(Show).all()


def get_show(db: Session, show_id: int) -> Show | None:
    return db.get(Show, show_id)


def create_show(db: Session, movie_id: int, screen_id: int, start_time) -> Show:
    show = Show(movie_id=movie_id, screen_id=screen_id, start_time=start_time)
    db.add(show)
    db.commit()
    db.refresh(show)
    return show


def update_show(db: Session, show: Show, movie_id: int | None, screen_id: int | None, start_time) -> Show:
    if movie_id is not None:
        show.movie_id = movie_id
    if screen_id is not None:
        show.screen_id = screen_id
    if start_time is not None:
        show.start_time = start_time
    db.commit()
    db.refresh(show)
    return show


def delete_show(db: Session, show: Show) -> None:
    db.delete(show)
    db.commit()
