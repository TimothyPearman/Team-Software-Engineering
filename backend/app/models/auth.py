from sqlalchemy import Column, Integer, String
from ..db.base import Base

class User(Base):
    """Represents a joined full user record from the Full_User view."""

    __tablename__ = "User"

    User_ID = Column(Integer, primary_key=True, index=True)
    Username = Column(String(100), nullable=False)
    Password_Hash = Column(String(255), nullable=False)
    CurrentStreak_ID = Column(Integer, nullable=True)
    FavouriteBadge_ID = Column(Integer, nullable=True)
    Progress_ID = Column(Integer, nullable=True)
