from typing import Optional, cast
from sqlalchemy.orm import Session
from ..models.auth import User as UserModel
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def authenticate_user(db: Session, username: str, password: str) -> Optional[UserModel]:
    """authenticate a user by username and password"""
    db_user = get_user_by_username(db, username)   # retrieve user from database
    
    if db_user is None:                    # check if user exists
        return None
    
    if not verify_password(password, cast(str, db_user.Password_Hash)):
        return None
    
    return db_user

def get_user_by_username(db: Session, username: str) -> Optional[UserModel]:
    """return a user by username"""
    return db.query(UserModel).filter(UserModel.Username == username).first()   # retrieve user record from the database by username

def create_user(db: Session, username: str, password: str, clearance: str):
    """create a new user"""
    hashed = hash_password(password)
    user = UserModel(Username=username, Password_Hash=hashed) # create a new user object with the given username and password
    
    db.add(user)        # add new user to database session
    db.commit()         # commit transaction to save new user to database
    db.refresh(user)    # refresh user object to get new id from database
    
    return user         # return newly created user object