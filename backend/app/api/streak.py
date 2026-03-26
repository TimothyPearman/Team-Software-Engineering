from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List

from ..db.session import get_db
from ..schemas.streak import StreakSchema as Streak
from ..crud import streak as streak_crud

from ..core.security import get_user_id_from_token

# Create a router for all dictionary-related endpoints.
router = APIRouter(
    prefix="/streaks",
    tags=["streaks"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token/get")

"""
GET Endpoints:
"""
@router.get("/get", response_model=List[Streak] | Streak, summary="?")
async def get_data(Streak_ID: int | None = None, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """?"""
    user_id = get_user_id_from_token(token)
    Streak = streak_crud.get_streak(db, user_id, Streak_ID)

    return Streak

"""
POST Endpoints:
"""
@router.post("/post", response_model=Streak, status_code=201, summary="?")
async def create_streak(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """?"""
    user_id = get_user_id_from_token(token)
    Streak = streak_crud.create_streak(db, user_id)

    return Streak

"""
PUT Endpoints:
"""
@router.put("/put", response_model=Streak, summary="?")
async def update_streak(Streak_ID: int, code: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """?"""
    user_id = get_user_id_from_token(token)
    Streak = streak_crud.update_streak(db, user_id, Streak_ID, code)
    
    return Streak