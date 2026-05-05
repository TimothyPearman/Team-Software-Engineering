from typing import Optional, cast
from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.streak import Streak as StreakModel, UserStreak as UserStreakModel
from ..models.auth import User as UserModel

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

def handle_daily_streak(db: Session, user_id: int) -> None:
    """Check login date and update streak accordingly."""
    from datetime import date, timedelta

    # get the user to find their current streak
    user = cast(Optional[UserModel], db.query(UserModel).filter(UserModel.User_ID == user_id).first())
    if not user:
        return

    user_row = cast(any, user)
    streak_id = user_row.CurrentStreak_ID
    if not streak_id:
        return

    # get the current streak
    streak = cast(Optional[StreakModel], db.query(StreakModel).filter(StreakModel.Streak_ID == streak_id).first())
    if not streak:
        return

    streak_row = cast(any, streak)
    today = date.today()
    yesterday = today - timedelta(days=1)

    # get the last date the streak was active
    last_date = streak_row.StartDate
    if streak_row.Count > 1:
        # estimate last login as StartDate + Count - 1 days
        last_date = streak_row.StartDate + timedelta(days=int(streak_row.Count) - 1)

    if last_date == today:
        # already logged in today do nothing
        return
    elif last_date == yesterday:
        # logged in yesterday increase streak
        streak_row.Count += 1
        db.commit()
    else:
        # missed a day end old streak and create a new one
        streak_row.EndDate = yesterday
        db.commit()

        # create new streak
        new_streak = StreakModel(
            StartDate=today,
            EndDate=None,
            Count=1
        )
        db.add(new_streak)
        db.commit()
        db.refresh(new_streak)

        # link new streak to user and update current streak
        new_user_streak = UserStreakModel(User_ID=user_id, Streak_ID=cast(int, new_streak.Streak_ID))
        db.add(new_user_streak)

        user_row.CurrentStreak_ID = new_streak.Streak_ID
        db.commit()