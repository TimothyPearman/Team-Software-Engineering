from typing import Optional, cast
from sqlalchemy.orm import Session
from sqlalchemy import text
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

def create_user(db: Session, username: str, password: str):
    """create a new user"""
    hashed = hash_password(password)

    # Full_User uses inner joins to Streak/Badge/Progress, so initialize linked rows.
    default_badge_id = db.execute(text("SELECT Badge_ID FROM Badge ORDER BY Badge_ID ASC LIMIT 1")).scalar_one_or_none()
    default_level_id = db.execute(text("SELECT Level_ID FROM Level ORDER BY Level_ID ASC LIMIT 1")).scalar_one_or_none()

    if default_badge_id is None or default_level_id is None:
        raise ValueError("Database is missing required seed data for Badge or Level")

    db.execute(text("INSERT INTO Streak (StartDate, EndDate, Count) VALUES (CURDATE(), NULL, 0)"))
    streak_id = cast(int, db.execute(text("SELECT LAST_INSERT_ID()")).scalar_one())

    db.execute(
        text("INSERT INTO Progress (Score, Level_ID) VALUES (0, :level_id)"),
        {"level_id": int(default_level_id)},
    )
    progress_id = cast(int, db.execute(text("SELECT LAST_INSERT_ID()")).scalar_one())

    user = UserModel(
        Username=username,
        Password_Hash=hashed,
        CurrentStreak_ID=cast(int, streak_id),
        FavouriteBadge_ID=int(default_badge_id),
        Progress_ID=cast(int, progress_id),
    )

    db.add(user)
    db.flush()

    db.execute(
        text("INSERT INTO User_Streak (User_ID, Streak_ID) VALUES (:user_id, :streak_id)"),
        {"user_id": cast(int, user.User_ID), "streak_id": cast(int, streak_id)},
    )
    db.execute(
        text("INSERT INTO User_Badge (User_ID, Badge_ID) VALUES (:user_id, :badge_id)"),
        {"user_id": cast(int, user.User_ID), "badge_id": int(default_badge_id)},
    )

    db.commit()
    db.refresh(user)

    return user