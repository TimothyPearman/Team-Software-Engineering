from sqlalchemy import Column, Integer
from ..db.base import Base

class Progress(Base):
    """Represents a record from the Progress table."""

    __tablename__ = "Progress"

    Progress_ID = Column(Integer, primary_key=True, index=True)
    Score = Column(Integer, default=0)
    Level_ID = Column(Integer, nullable=True)