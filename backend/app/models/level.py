from sqlalchemy import Column, Date, Integer, String

from ..db.base import Base

class Level(Base):
    """Represents record from the Level table"""

    __tablename__ = "Level"

    Level_ID = Column(Integer, primary_key=True, index=True)
    Dictionary_ID = Column(Integer, nullable=False)

