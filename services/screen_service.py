from sqlalchemy.orm import Session

from app.models.models import Screen


def list_screens(db: Session) -> list[Screen]:
    return db.query(Screen).all()


def get_screen(db: Session, screen_id: int) -> Screen | None:
    return db.get(Screen, screen_id)


def create_screen(db: Session, cinema_id: int, name: str) -> Screen:
    screen = Screen(cinema_id=cinema_id, name=name)
    db.add(screen)
    db.commit()
    db.refresh(screen)
    return screen


def update_screen(db: Session, screen: Screen, name: str | None) -> Screen:
    if name is not None:
        screen.name = name
    db.commit()
    db.refresh(screen)
    return screen


def delete_screen(db: Session, screen: Screen) -> None:
    db.delete(screen)
    db.commit()
