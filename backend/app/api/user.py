# endpoints for user profile and account-related operations
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..core.security import get_user_id_from_token
from ..crud import auth as auth_crud
from ..crud import badge as badge_crud
from ..crud import user as user_crud
from ..crud.user import get_progress, get_user_level_id, update_score, update_user_level_id
from ..schemas.badge import UserBadgeSchema as UserBadge
from ..schemas.progress import ProgressSchema
from ..db.session import get_db
from ..schemas.auth import UserSchema
from ..schemas.badge import BadgeSchema
from ..schemas.user import FullUserSchema as FullUser

# Create a router for all user-related endpoints.
router = APIRouter(
    prefix="/users",
    tags=["users"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token/get")


"""
GET Endpoints:
"""
@router.get("/get", summary="get the current user")
async def get_data(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Return the currently authenticated user."""
    user_id = get_user_id_from_token(token)
    full_user = user_crud.get_full_user(db, user_id)
    return full_user

@router.get("/score/get", response_model=ProgressSchema, summary="get the current users score and level")
async def get_score(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Return the current users score and level."""
    user_id = get_user_id_from_token(token)
    return get_progress(db, user_id)

@router.get("/level/get", response_model=int, summary="get the current users level id")
async def get_level(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Return the current user's level id."""
    user_id = get_user_id_from_token(token)
    return get_user_level_id(db, user_id)

@router.put("/score/put", response_model=ProgressSchema, summary="update the current users score")
async def update_user_score(score_to_add: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Add to the users score and updates level if thresholds are crossed."""
    user_id = get_user_id_from_token(token)
    return update_score(db, user_id, score_to_add)

@router.put("/level/put", response_model=ProgressSchema, summary="update the current users level id")
async def update_user_level(Level_ID: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Set the current user's level id."""
    user_id = get_user_id_from_token(token)
    return update_user_level_id(db, user_id, Level_ID)

"""
POST Endpoints:
"""
@router.post("/post", response_model=UserSchema, status_code=201, summary="?")
async def create_user(username: str, password: str, db: Session = Depends(get_db)):
    """Create a new user."""
    existing_user = auth_crud.get_user_by_username(db, username)
    if existing_user:
        raise HTTPException(status_code=409, detail="Username already exists")

    new_user = auth_crud.create_user(db, username, password)
    return new_user

@router.post("/badge/post", response_model=UserBadge, status_code=201, summary="create a user badge")
async def create_user_badge(badge_id: int, user_id: int | None = None, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Create a new badge row for a user."""
    current_user_id = user_id if user_id is not None else get_user_id_from_token(token)
    created_user_badge = badge_crud.create_user_badge(db, current_user_id, badge_id)

    return created_user_badge


"""
PUT Endpoints:
"""
@router.put("/badge/put", response_model=BadgeSchema, summary="update a badge")
async def update_badge(badge_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Update a badge record."""
    user_id = get_user_id_from_token(token)
    updated_badge = user_crud.update_badge(
        db,
        user_id,
        badge_id,
    )

    return updated_badge

"""
DELETE Endpoints:
"""
@router.delete("/delete", response_model=UserSchema, summary="delete the current user")
async def delete_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Delete the currently authenticated user."""
    user_id = get_user_id_from_token(token)
    deleted_user = user_crud.delete_user(db, user_id)
    return deleted_user
