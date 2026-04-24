from sqlalchemy import Column, Integer, String

from ..db.base import Base


class Badge(Base):
    """Represents a record from the Badge table."""

    __tablename__ = "Badge"

    Badge_ID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(100), nullable=False)
    Description = Column(String(255), nullable=True)


class UserBadges(Base):
    """Represents a record from the User_Badge join table."""

    __tablename__ = "User_Badges"

    User_ID = Column(Integer, primary_key=True, index=True)
    Badge_ID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(100), nullable=False)
    Description = Column(String(255), nullable=True)