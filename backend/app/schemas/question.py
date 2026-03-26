from pydantic import BaseModel

class QuestionSchema(BaseModel):
    """schema returned by GET /users/get"""
    Question_ID: int
    Level_ID: int
    Question: str
    Answer: str

    class Config:
        from_attributes = True

