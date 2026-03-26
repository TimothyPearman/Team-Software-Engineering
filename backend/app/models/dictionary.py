from sqlalchemy import Column, Date, Integer, String

from ..db.base import Base

class Dictionary(Base):
    """Represents record from the Dictionary table"""

    __tablename__ = "Dictionary"

    Dictionary_ID = Column(Integer, primary_key=True, index=True)
    Description = Column(String(100), nullable=False)

