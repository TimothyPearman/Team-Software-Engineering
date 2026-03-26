from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..crud import question as question_crud
from ..db.session import get_db
from ..schemas.question import QuestionSchema as Question

# Create a router for all question-related endpoints.
router = APIRouter(
    prefix="/Questions",
    tags=["Questions"],
)

"""
GET Endpoints:
"""
@router.get("/get", response_model=List[Question] | Question, summary="?")
async def get_data(Question_ID: int | None = None, Level_ID: int | None = None, db: Session = Depends(get_db)):
    """Return one question by id, or all questions linked to the given level id."""
    question = question_crud.get_question(db, Question_ID, Level_ID)
    return question
