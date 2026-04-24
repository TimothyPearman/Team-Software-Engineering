from sqlalchemy import Column, Date, Integer, String

from ..db.base import Base

class FullUser(Base):
    """Represents a joined full user record from the Full_User view."""

    __tablename__ = "Full_User"

    User_ID = Column(Integer, primary_key=True, index=True)
    Username = Column(String(100), nullable=False)
    Password_Hash = Column(String(255), nullable=False)
    StartDate = Column(Date, nullable=False)
    EndDate = Column(Date, nullable=True)
    Count = Column(Integer, nullable=False)
    Badge_ID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(100), nullable=False)
    Description = Column(String(255), nullable=True)
    Level_ID = Column(Integer, nullable=True)
    Score = Column(Integer, nullable=True)
