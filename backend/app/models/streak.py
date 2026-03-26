from sqlalchemy import Column, Date, Integer, String

from ..db.base import Base

class Streak(Base):
    """Represents record from the Streak table"""

    __tablename__ = "Streak"

    Streak_ID = Column(Integer, primary_key=True, index=True)
    StartDate = Column(Date, nullable=False)
    EndDate = Column(Date, nullable=True) 
    Count = Column(Integer, nullable=False)


class UserStreak(Base):
    """Represents record from the User_Streak join table."""

    __tablename__ = "User_Streak"

    User_ID = Column(Integer, primary_key=True, index=True)
    Streak_ID = Column(Integer, primary_key=True, index=True)

