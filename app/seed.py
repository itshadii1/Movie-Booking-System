from __future__ import annotations
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.database import SessionLocal, engine

from app.models.models import Cinema, Screen, Movie, Show
from app.models.models import User
from app.core.security import hash_password


def seed() -> None:
    db: Session = SessionLocal()
    try:
        if db.query(User).count() == 0:
            user = User(
                name="host",
                email="host@gmail.com",
                password=hash_password("pass123"),
                is_admin=1
            )
            db.add(user)
            db.flush()
        if db.query(Cinema).count() == 0:
            c1 = Cinema(name="PVR Downtown", location="Downtown")
            c2 = Cinema(name="INOX Mall", location="City Mall")
            db.add_all([c1, c2])
            db.flush()

            s1 = Screen(cinema_id=c1.id, name="Screen 1")
            s2 = Screen(cinema_id=c1.id, name="Screen 2")
            s3 = Screen(cinema_id=c2.id, name="Audi 1")
            db.add_all([s1, s2, s3])

        if db.query(Movie).count() == 0:
            m1 = Movie(
                title="Inception",
                description="A mind-bending thriller.",
                duration=148,
                image_url="/images/inception.png"
            )
            m2 = Movie(
                title="Interstellar",
                description="Space odyssey.",
                duration=169,
                image_url=None
            )
            db.add_all([m1, m2])
            db.flush()

        if db.query(Show).count() == 0:
            screens = db.query(Screen).all()
            movies = db.query(Movie).all()
            base_time = datetime.now().replace(minute=0, second=0, microsecond=0)
            shows = []
            for i, sc in enumerate(screens):
                for j, mv in enumerate(movies):
                    shows.append(Show(movie_id=mv.id, screen_id=sc.id, start_time=base_time + timedelta(hours=i * 3 + j * 2)))
            db.add_all(shows)

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()



