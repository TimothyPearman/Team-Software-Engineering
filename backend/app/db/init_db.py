from ..db.base import Base
from ..db.session import engine

from ..models.auth import User  # noqa: F401

def init_db():
    """create tables in the database if they do not already exist"""
    Base.metadata.create_all(bind=engine)
    

