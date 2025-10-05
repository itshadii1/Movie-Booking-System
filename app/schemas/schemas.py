from __future__ import annotations
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


# Shared
class Message(BaseModel):
    detail: str


# Auth
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Users
class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: int
    is_admin: int

    class Config:
        from_attributes = True


# Cinema
class CinemaBase(BaseModel):
    name: str
    location: str


class CinemaCreate(CinemaBase):
    pass


class CinemaUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None


class CinemaOut(CinemaBase):
    id: int

    class Config:
        from_attributes = True


# Screen
class ScreenBase(BaseModel):
    cinema_id: int
    name: str


class ScreenCreate(ScreenBase):
    pass


class ScreenUpdate(BaseModel):
    name: Optional[str] = None


class ScreenOut(BaseModel):
    id: int
    cinema_id: int
    name: str

    class Config:
        from_attributes = True


# Movie
class MovieBase(BaseModel):
    title: str
    description: str
    duration: int


class MovieCreate(MovieBase):
    pass


class MovieUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None


class MovieOut(MovieBase):
    id: int

    class Config:
        from_attributes = True


# Show
class ShowBase(BaseModel):
    movie_id: int
    screen_id: int
    start_time: datetime


class ShowCreate(ShowBase):
    pass


class ShowUpdate(BaseModel):
    movie_id: Optional[int] = None
    screen_id: Optional[int] = None
    start_time: Optional[datetime] = None


class ShowOut(ShowBase):
    id: int

    class Config:
        from_attributes = True


# Booking
class Seat(BaseModel):
    row: int
    col: int


class BookingCreate(BaseModel):
    show_id: int
    seats: List[Seat] = Field(min_items=1, max_items=6)


class BookingOut(BaseModel):
    id: int
    user_id: int
    show_id: int
    seats: List[Seat]
    created_at: datetime

    class Config:
        from_attributes = True
