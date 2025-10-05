from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.schemas import BookingCreate, BookingOut
from app.services import booking_service, auth_service

router = APIRouter()


@router.post("/", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    booking = booking_service.create_booking(db, current_user.id, payload.show_id, [s.model_dump() for s in payload.seats])
    return booking


@router.get("/me", response_model=list[BookingOut])
def my_bookings(db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    return booking_service.list_user_bookings(db, current_user.id)


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_booking(booking_id: int, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    booking_service.cancel_booking(db, current_user.id, booking_id)
    return None
