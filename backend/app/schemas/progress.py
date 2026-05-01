from pydantic import BaseModel

class ProgressSchema(BaseModel):
    Progress_ID: int
    Score: int | None
    Level_ID: int | None

    class Config:
        from_attributes = True