from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.schemas import CinemaOut, CinemaCreate, CinemaUpdate
from app.services import cinema_service, auth_service

router = APIRouter()


@router.get("/", response_model=list[CinemaOut])
def list_all(db: Session = Depends(get_db)):
    return cinema_service.list_cinemas(db)


@router.get("/{cinema_id}", response_model=CinemaOut)
def get_one(cinema_id: int, db: Session = Depends(get_db)):
    cinema = cinema_service.get_cinema(db, cinema_id)
    if not cinema:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cinema not found")
    return cinema


@router.post("/", response_model=CinemaOut, status_code=status.HTTP_201_CREATED)
def create(payload: CinemaCreate, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    return cinema_service.create_cinema(db, payload.name, payload.location)


@router.put("/{cinema_id}", response_model=CinemaOut)
def update(cinema_id: int, payload: CinemaUpdate, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    cinema = cinema_service.get_cinema(db, cinema_id)
    if not cinema:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cinema not found")
    return cinema_service.update_cinema(db, cinema, payload.name, payload.location)


@router.delete("/{cinema_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(cinema_id: int, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    cinema = cinema_service.get_cinema(db, cinema_id)
    if not cinema:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cinema not found")
    cinema_service.delete_cinema(db, cinema)
    return None
