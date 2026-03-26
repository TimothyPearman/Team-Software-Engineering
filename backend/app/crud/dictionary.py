from typing import Optional, cast

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from ..models.dictionary import Dictionary as DictionaryModel

def get_dictionary(db: Session, Dictionary_ID: int) -> Optional[DictionaryModel]:
    """Get a dictionary entry by its ID."""
    dictionary = cast(Optional[DictionaryModel], db.query(DictionaryModel).filter(DictionaryModel.Dictionary_ID == Dictionary_ID).first())

    if not dictionary:
        raise HTTPException(status_code=404, detail="Dictionary not found")
    
    return dictionary