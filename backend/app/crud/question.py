from typing import Optional, cast

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.question import Question as QuestionModel

def get_question(db: Session, Question_ID: int | None = None, Level_ID: int | None = None) -> QuestionModel | list[QuestionModel]:
    """Get one question by ID, or all questions linked to a level."""
    if Question_ID is not None:
        query = db.query(QuestionModel).filter(QuestionModel.Question_ID == Question_ID)
        if Level_ID is not None:
            query = query.filter(QuestionModel.Level_ID == Level_ID)

        question = cast(Optional[QuestionModel], query.first())
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        return question

    if Level_ID is not None:
        questions = cast(list[QuestionModel], db.query(QuestionModel).filter(QuestionModel.Level_ID == Level_ID).all())
        if not questions:
            raise HTTPException(status_code=404, detail="No questions found for level")
        return questions

    raise HTTPException(status_code=400, detail="Provide Question_ID or Level_ID")