from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..db.session import get_db
from ..schemas.dictionary import DictionarySchema as Dictionary
from ..crud import dictionary as dictionary_crud

# Create a router for all dictionary-related endpoints.
router = APIRouter(
    prefix="/dictionary",
    tags=["dictionary"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token/get")

"""
GET Endpoints:
"""
@router.get("/get", response_model=Dictionary, summary="?")
async def get_data(Dictionary_ID: int, db: Session = Depends(get_db)):
    """?"""
    Dictionary = dictionary_crud.get_dictionary(db, Dictionary_ID)
    return Dictionary
