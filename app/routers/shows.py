from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.schemas import ShowOut, ShowCreate, ShowUpdate
from app.services import show_service, auth_service

router = APIRouter()


@router.get("/", response_model=list[ShowOut])
def list_all(db: Session = Depends(get_db)):
    return show_service.list_shows(db)


@router.get("/{show_id}", response_model=ShowOut)
def get_one(show_id: int, db: Session = Depends(get_db)):
    show = show_service.get_show(db, show_id)
    if not show:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Show not found")
    return show


@router.post("/", response_model=ShowOut, status_code=status.HTTP_201_CREATED)
def create(payload: ShowCreate, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    return show_service.create_show(db, payload.movie_id, payload.screen_id, payload.start_time)


@router.put("/{show_id}", response_model=ShowOut)
def update(show_id: int, payload: ShowUpdate, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    show = show_service.get_show(db, show_id)
    if not show:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Show not found")
    return show_service.update_show(db, show, payload.movie_id, payload.screen_id, payload.start_time)


@router.delete("/{show_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(show_id: int, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    show = show_service.get_show(db, show_id)
    if not show:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Show not found")
    show_service.delete_show(db, show)
    return None


@router.get("/{show_id}/bookings")
def get_show_bookings(show_id: int, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    from app.models.models import Booking
    bookings = db.query(Booking).filter(Booking.show_id == show_id).all()
    return [
        {
            "seat": booking.seat,
            "user": {
                "name": booking.user.name,
                "email": booking.user.email
            }
        }
        for booking in bookings
    ]
