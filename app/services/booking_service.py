from __future__ import annotations
from typing import List, Set, Tuple

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.models import Booking, Show

TOTAL_ROWS = 10
TOTAL_COLS = 10


def _to_tuple(seat: dict) -> Tuple[int, int]:
    return (int(seat["row"]), int(seat["col"]))


def _validate_seats(seats: List[dict]) -> None:
    unique: Set[Tuple[int, int]] = set()
    for seat in seats:
        r, c = _to_tuple(seat)
        if not (0 <= r < TOTAL_ROWS and 0 <= c < TOTAL_COLS):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Seat out of range")
        if (r, c) in unique:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Duplicate seats not allowed")
        unique.add((r, c))


def _load_booked(db: Session, show_id: int) -> Set[Tuple[int, int]]:
    booked: Set[Tuple[int, int]] = set()
    for b in db.query(Booking).filter(Booking.show_id == show_id).all():
        for s in b.seats:
            booked.add(_to_tuple(s))
    return booked


def create_booking(db: Session, user_id: int, show_id: int, seats: List[dict]) -> Booking:
    _validate_seats(seats)
    show = db.get(Show, show_id)
    if not show:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Show not found")

    booked = _load_booked(db, show_id)
    requested = {_to_tuple(s) for s in seats}

    if booked.intersection(requested):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Some seats already booked")

    booking = Booking(user_id=user_id, show_id=show_id, seats=seats)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def list_user_bookings(db: Session, user_id: int) -> list[Booking]:
    return db.query(Booking).filter(Booking.user_id == user_id).order_by(Booking.created_at.desc()).all()


def cancel_booking(db: Session, user_id: int, booking_id: int) -> None:
    booking = db.get(Booking, booking_id)
    if not booking or booking.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    db.delete(booking)
    db.commit()
