from sqlalchemy import Column, Date, Integer, String

from ..db.base import Base

class Question(Base):
    """Represents record from the Question table"""

    __tablename__ = "Question"

    Question_ID = Column(Integer, primary_key=True, index=True)
    Level_ID = Column(Integer, nullable=False)
    Question = Column(String(255), nullable=False)
    Answer = Column(String(255), nullable=False)

