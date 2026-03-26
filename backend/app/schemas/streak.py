from pydantic import BaseModel
from datetime import date

class StreakSchema(BaseModel):
    """schema returned by GET /users/get"""
    Streak_ID: int
    StartDate: date
    EndDate: date | None
    Count: int

    class Config:
        from_attributes = True

