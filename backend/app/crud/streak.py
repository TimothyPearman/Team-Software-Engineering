from typing import Optional, cast
from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.streak import Streak as StreakModel, UserStreak as UserStreakModel

def get_streak(db: Session, user_id: int, streak_id: int | None = None) -> StreakModel | list[StreakModel]:
    """Get all streaks for a user, or a specific streak when streak_id is provided."""
    query = (
        db.query(StreakModel)
        .join(UserStreakModel, UserStreakModel.Streak_ID == StreakModel.Streak_ID)
        .filter(UserStreakModel.User_ID == user_id)
    )

    if streak_id is not None:
        streak = cast(Optional[StreakModel], query.filter(StreakModel.Streak_ID == streak_id).first())
        if not streak:
            raise HTTPException(status_code=404, detail="Streak not found")
        return streak

    streaks = cast(list[StreakModel], query.all())
    if not streaks:
        raise HTTPException(status_code=404, detail="No streaks found for user")

    return streaks

def create_streak(db: Session, user_id: int) -> StreakModel:
    """Create a new streak entry."""
    new_streak = StreakModel(
        StartDate=date.today(),
        EndDate=None,
        Count=1
    )
    db.add(new_streak)
    db.commit()
    db.refresh(new_streak)

    user_streak = UserStreakModel(User_ID=user_id, Streak_ID=cast(int, new_streak.Streak_ID))
    db.add(user_streak)
    db.commit()

    return new_streak

def update_streak(db: Session, user_id: int, Streak_ID: int, code: int) -> StreakModel:
    """Update an existing streak entry."""
    streak = cast(
        Optional[StreakModel],
        db.query(StreakModel)
        .join(UserStreakModel, UserStreakModel.Streak_ID == StreakModel.Streak_ID)
        .filter(StreakModel.Streak_ID == Streak_ID, UserStreakModel.User_ID == user_id)
        .first(),
    )
    
    if not streak:
        raise HTTPException(status_code=404, detail="Streak not found")

    if code == 0:  # code 0 = streak continued, increment count
        streak.Count += 1               # type: ignore  #types here are wrong at checking, correct at runtime, :/
    elif code == 1:  # code 1 = streak ended, set end date
        streak.EndDate = date.today()   # type: ignore
    else:
        raise HTTPException(status_code=400, detail="Invalid code. Use 0 to continue or 1 to end streak")
    
    db.commit()
    db.refresh(streak)
    return streak