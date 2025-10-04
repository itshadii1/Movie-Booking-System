from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.schemas import MovieOut, MovieCreate, MovieUpdate
from app.services import movie_service, auth_service

router = APIRouter()


@router.get("/", response_model=list[MovieOut])
def list_all(db: Session = Depends(get_db)):
    return movie_service.list_movies(db)


@router.get("/{movie_id}", response_model=MovieOut)
def get_one(movie_id: int, db: Session = Depends(get_db)):
    movie = movie_service.get_movie(db, movie_id)
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
    return movie


@router.post("/", response_model=MovieOut, status_code=status.HTTP_201_CREATED)
def create(payload: MovieCreate, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    return movie_service.create_movie(db, payload.title, payload.description, payload.duration)


@router.put("/{movie_id}", response_model=MovieOut)
def update(movie_id: int, payload: MovieUpdate, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    movie = movie_service.get_movie(db, movie_id)
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
    return movie_service.update_movie(db, movie, payload.title, payload.description, payload.duration)


@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(movie_id: int, db: Session = Depends(get_db), current_user=Depends(auth_service.get_current_user)):
    auth_service.ensure_admin(current_user)
    movie = movie_service.get_movie(db, movie_id)
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
    movie_service.delete_movie(db, movie)
    return None
