from typing import Optional, cast, Any

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..models.user import FullUser as FullUserModel
from ..models.progress import Progress as ProgressModel
from ..models.auth import User as UserModel
from ..models.badge import Badge as BadgeModel

from ..crud.badge import get_badge_by_id


def get_full_user(db: Session, user_id: int):
    """Get a user by their ID."""
    result = db.execute(
        text("SELECT * FROM Full_User WHERE User_ID = :user_id"),
        {"user_id": user_id}
    ).mappings().first()

    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    
    return dict(result)

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

def update_badge(db: Session, user_id: int, badge_id: int) -> BadgeModel:
    """Update the user's favorite badge."""
    # Verify the badge exists
    badge = get_badge_by_id(db, badge_id)
    
    # Get the user and update their favorite badge
    user = cast(Optional[UserModel], db.query(UserModel).filter(UserModel.User_ID == user_id).first())
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update the user's favorite badge
    user_row = cast(Any, user)
    user_row.FavouriteBadge_ID = badge_id
    db.commit()
    db.refresh(user)
    
    return badge

def get_progress(db: Session, user_id: int) -> ProgressModel:
    """Get the progress record for a user."""
    user = cast(Optional[UserModel], db.query(UserModel).filter(UserModel.User_ID == user_id).first())
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_row = cast(Any, user)
    progress = cast(Optional[ProgressModel], db.query(ProgressModel).filter(ProgressModel.Progress_ID == user_row.Progress_ID).first())
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")

    return progress


def get_user_level_id(db: Session, user_id: int) -> int:
    """Get the current user's level id."""
    progress = get_progress(db, user_id)
    progress_row = cast(Any, progress)

    if progress_row.Level_ID is None:
        raise HTTPException(status_code=404, detail="User level not found")

    return int(progress_row.Level_ID)


def update_user_level_id(db: Session, user_id: int, level_id: int) -> ProgressModel:
    """Set the current user's level id."""
    progress = get_progress(db, user_id)
    progress_row = cast(Any, progress)

    progress_row.Level_ID = level_id

    db.commit()
    db.refresh(progress)

    return progress


def update_score(db: Session, user_id: int, score_to_add: int) -> ProgressModel:
    """Add to the users score and update level if thresholds are crossed."""
    progress = get_progress(db, user_id)
    progress_row = cast(Any, progress)

    # add the new score to the existing score
    progress_row.Score = (progress_row.Score or 0) + score_to_add

    # get users current level
    current_level = get_user_level_id(db, user_id)

    # calculate new level from new score (1000 points per level, starting at level 1 with 0 points)
    new_level = progress_row.Score // 1000 + 1

    if new_level > current_level:
        update_user_level_id(db, user_id, new_level)
    db.commit()
    db.refresh(progress)

    return progress