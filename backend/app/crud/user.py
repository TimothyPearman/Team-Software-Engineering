from typing import Optional, cast

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.user import FullUser as FullUserModel
from ..models.auth import User as UserModel


def get_full_user(db: Session, user_id: int) -> Optional[FullUserModel]:
    """Get a user by their ID."""
    full_user = cast(Optional[FullUserModel], db.query(FullUserModel).filter(FullUserModel.User_ID == user_id).first())

    if not full_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return full_user

def create_user(db: Session, username: str, password: str):
    """create a new user"""
    user = UserModel(Username=username, Password_Hash=password) # create a new user object with the given username and password
    
    db.add(user)        # add new user to database session
    db.commit()         # commit transaction to save new user to database
    db.refresh(user)    # refresh user object to get new id from database
    
    return user         # return newly created user object


def delete_user(db: Session, user_id: int) -> UserModel:
    """Delete a user by id and return the deleted record."""
    user = cast(Optional[UserModel], db.query(UserModel).filter(UserModel.User_ID == user_id).first())

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return user