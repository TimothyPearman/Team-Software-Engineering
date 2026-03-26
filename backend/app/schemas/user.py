from pydantic import BaseModel
from datetime import date

class FullUserSchema(BaseModel):
    """schema returned by GET /users/get with all related data"""
    User_ID: int        # ! temp
    Username: str
    Password_Hash: str  # ! temp
    StartDate: date
    EndDate: date | None
    Count: int
    Name: str
    Description: str | None
    Asset: str | None
    Level_ID: int | None
