from typing import List

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..core.security import get_user_id_from_token
from ..crud import badge as badge_crud
from ..db.session import get_db
from ..schemas.badge import UserBadgeSchema as UserBadge


router = APIRouter(
    prefix="/badges",
    tags=["badges"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token/get")


@router.get("/get", response_model=List[UserBadge], summary="get the current user's badges")
async def get_badges(badge_id: int | None = None, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Return all user badges, or only those matching badge_id when provided."""
    user_id = get_user_id_from_token(token)
    user_badges = badge_crud.get_user_badges(db, user_id, badge_id)

    return user_badges