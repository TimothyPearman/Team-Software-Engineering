from pydantic import BaseModel

class LevelSchema(BaseModel):
    """schema returned by GET /users/get"""
    Level_ID: int
    Dictionary_ID: int

    class Config:
        from_attributes = True

