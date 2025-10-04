from __future__ import annotations
from datetime import datetime
from typing import List

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, JSON, UniqueConstraint
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.core.database import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_admin: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    bookings: Mapped[List["Booking"]] = relationship("Booking", back_populates="user")


class Cinema(Base, TimestampMixin):
    __tablename__ = "cinemas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)

    screens: Mapped[List["Screen"]] = relationship("Screen", back_populates="cinema", cascade="all, delete-orphan")


class Screen(Base, TimestampMixin):
    __tablename__ = "screens"
    __table_args__ = (
        UniqueConstraint("cinema_id", "name", name="uq_screen_cinema_name"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    cinema_id: Mapped[int] = mapped_column(ForeignKey("cinemas.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    cinema: Mapped[Cinema] = relationship("Cinema", back_populates="screens")
    shows: Mapped[List["Show"]] = relationship("Show", back_populates="screen", cascade="all, delete-orphan")


class Movie(Base, TimestampMixin):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)  # minutes

    shows: Mapped[List["Show"]] = relationship("Show", back_populates="movie", cascade="all, delete-orphan")


class Show(Base, TimestampMixin):
    __tablename__ = "shows"
    __table_args__ = (
        UniqueConstraint("screen_id", "start_time", name="uq_show_screen_time"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id", ondelete="CASCADE"), nullable=False, index=True)
    screen_id: Mapped[int] = mapped_column(ForeignKey("screens.id", ondelete="CASCADE"), nullable=False, index=True)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)

    movie: Mapped[Movie] = relationship("Movie", back_populates="shows")
    screen: Mapped[Screen] = relationship("Screen", back_populates="shows")
    bookings: Mapped[List["Booking"]] = relationship("Booking", back_populates="show", cascade="all, delete-orphan")


class Booking(Base, TimestampMixin):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    show_id: Mapped[int] = mapped_column(ForeignKey("shows.id", ondelete="CASCADE"), nullable=False, index=True)
    seats: Mapped[list] = mapped_column(JSON, nullable=False)  # list of {row:int, col:int}

    user: Mapped[User] = relationship("User", back_populates="bookings")
    show: Mapped[Show] = relationship("Show", back_populates="bookings")
