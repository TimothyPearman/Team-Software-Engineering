# endpoints for user profile and account-related operations
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..core.security import get_user_id_from_token
from ..crud import auth as auth_crud
from ..crud import user as user_crud
from ..db.session import get_db
from ..schemas.auth import UserSchema
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
@router.get("/get", response_model=FullUser, summary="get the current user")
async def get_data(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Return the currently authenticated user."""
    user_id = get_user_id_from_token(token)
    full_user = user_crud.get_full_user(db, user_id)

    return full_user


"""
POST Endpoints:
"""
@router.post("/post", response_model=UserSchema, status_code=201, summary="?")
async def create_user(username: str, password: str, db: Session = Depends(get_db)):
    """Create a new user."""
    existing_user = auth_crud.get_user_by_username(db, username)
    if existing_user:
        raise HTTPException(status_code=409, detail="Username already exists")

    new_user = user_crud.create_user(db, username, password)
    return new_user


"""
PUT Endpoints:
"""
# @router.put("/put", response_model=FullUser, summary="?")
# async def update_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     """?"""
#     return None


"""
DELETE Endpoints:
"""
@router.delete("/delete", response_model=UserSchema, summary="delete the current user")
async def delete_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Delete the currently authenticated user."""
    user_id = get_user_id_from_token(token)
    deleted_user = user_crud.delete_user(db, user_id)
    return deleted_user
