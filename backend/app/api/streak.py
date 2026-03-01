# endpoints for getting and updating the users daily streak
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List

from ..db.session import get_db
from ..schemas.dictionary import PlaceHolder
#from ..crud import notice as crud_notice, user as crud_user
#from ..models.user import User as UserModel
#from ..core.security import get_user_id_from_token, ExpiredSignatureError, InvalidTokenError

# Create a router for all notice-related endpoints.
router = APIRouter(
    prefix="/streaks",
    tags=["streaks"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token/get")

def check_valid_user(db: Session = Depends(get_db)):
    pass

def get_user_clearance(db: Session = Depends(get_db)):
    pass

"""
GET Endpoints:
"""
@router.get("/get", response_model=PlaceHolder, summary="?")
async def get_data(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """?"""
    return None

"""
POST Endpoints:
"""
@router.post("/post", response_model=PlaceHolder, status_code=201, summary="?")
async def create_notice(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """?"""
    return None

"""
PUT Endpoints:
"""
@router.put("/put", response_model=PlaceHolder, summary="?")
async def update_notice(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """?"""
    return None

"""
DELETE Endpoints:
"""
@router.delete("/delete", response_model=PlaceHolder, summary="?")
async def delete_notice(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """?"""
    return None