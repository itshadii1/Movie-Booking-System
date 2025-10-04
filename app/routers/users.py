from fastapi import APIRouter, Depends

from app.schemas.schemas import UserOut
from app.services import auth_service

router = APIRouter()


@router.get("/me", response_model=UserOut)
def profile(current_user=Depends(auth_service.get_current_user)):
    return current_user
