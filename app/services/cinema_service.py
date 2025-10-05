from sqlalchemy.orm import Session

from app.models.models import Cinema


def list_cinemas(db: Session) -> list[Cinema]:
    return db.query(Cinema).all()


def get_cinema(db: Session, cinema_id: int) -> Cinema | None:
    return db.get(Cinema, cinema_id)


def create_cinema(db: Session, name: str, location: str) -> Cinema:
    cinema = Cinema(name=name, location=location)
    db.add(cinema)
    db.commit()
    db.refresh(cinema)
    return cinema


def update_cinema(db: Session, cinema: Cinema, name: str | None, location: str | None) -> Cinema:
    if name is not None:
        cinema.name = name
    if location is not None:
        cinema.location = location
    db.commit()
    db.refresh(cinema)
    return cinema


def delete_cinema(db: Session, cinema: Cinema) -> None:
    db.delete(cinema)
    db.commit()
