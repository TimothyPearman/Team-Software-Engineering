# endpoints for user such as progression, cosmetics and creating new users
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Annotated, cast

from ..db.session import get_db
from ..schemas.user import FullUserSchema
from ..schemas.auth import UserSchema, Token
from ..crud import auth as crud_user
from ..core.security import (
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_user_id_from_token,
    ExpiredSignatureError,
    InvalidTokenError,
)
from ..core.token import revoke_token as denylist_revoke_token
from ..models.auth import User as UserModel
    
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token/get")           # define the OAuth2 scheme for token authentication

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

def check_valid_user(token, db: Session = Depends(get_db)):
    try:
        user_id = get_user_id_from_token(token)
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token value")

    user = db.query(UserModel).filter(UserModel.User_ID == user_id).first()      # query the database for a user with the given id from the token
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.post("/token/get", response_model=Token, summary="provide token")
async def issue_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    """issue a bearer token"""
    user = crud_user.authenticate_user(db, form_data.username, form_data.password)      # get user from database with matching username and password
    
    if not user:                                                                        # check user exists and password is correct
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(cast(int, user.User_ID))                         # create token
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES,
    }

@router.put("/token/refresh", response_model=Token, summary="refresh token")
async def refresh_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """refresh the current token by revoking the old one and issuing a new one"""
    user = check_valid_user(token, db)                                                  # check if logged in user still exists
    access_token = create_access_token(cast(int, user.User_ID))                         # create new token
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES,
    }

@router.delete("/token/revoke", summary="revoke token")
async def revoke_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """revoke current bearer token"""
    #user = check_valid_user(token, db) # dont need to check if user exists since the token is being revoked anyway right?
    
    denylist_revoke_token(token)                                                        # add token to denylist
    
    return {"message": "Token revoked successfully"} 