from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db.session import get_db
from ..schemas.dictionary import DictionarySchema as Dictionary
from ..crud import dictionary as dictionary_crud

# Create a router for all dictionary-related endpoints.
router = APIRouter(
    prefix="/dictionary",
    tags=["dictionary"],
)

"""
GET Endpoints:
"""
@router.get("/get", response_model=List[Dictionary] | Dictionary, summary="?")
async def get_data(Dictionary_ID: int | None = None, db: Session = Depends(get_db)):
    """Return one dictionary entry by id, or all entries when no id is provided."""
    Dictionary = dictionary_crud.get_dictionary(db, Dictionary_ID)
    return Dictionary
