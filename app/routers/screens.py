from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.schemas import ScreenOut, ScreenCreate, ScreenUpdate
from app.services import screen_service, auth_service

router = APIRouter()


@router.get("/", response_model=list[ScreenOut])
def list_all(db: Session = Depends(get_db)):
    return screen_service.list_screens(db)


@router.get("/{screen_id}", response_model=ScreenOut)
def get_one(screen_id: int, db: Session = Depends(get_db)):
    screen = screen_service.get_screen(db, screen_id)
    if not screen:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Screen not found")
    return screen


@router.post("/", response_model=ScreenOut, status_code=status.HTTP_201_CREATED)
def create(payload: ScreenCreate, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    return screen_service.create_screen(db, payload.cinema_id, payload.name)


@router.put("/{screen_id}", response_model=ScreenOut)
def update(screen_id: int, payload: ScreenUpdate, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    screen = screen_service.get_screen(db, screen_id)
    if not screen:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Screen not found")
    return screen_service.update_screen(db, screen, payload.name)


@router.delete("/{screen_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(screen_id: int, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    screen = screen_service.get_screen(db, screen_id)
    if not screen:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Screen not found")
    screen_service.delete_screen(db, screen)
    return None
