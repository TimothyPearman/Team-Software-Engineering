from typing import Optional, cast

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.dictionary import Dictionary as DictionaryModel

def get_dictionary(db: Session, Dictionary_ID: int | None = None) -> Optional[DictionaryModel] | list[DictionaryModel]:
    """Get one dictionary entry by ID, or all dictionary entries when no ID is provided."""
    if Dictionary_ID is None:
        dictionaries = cast(list[DictionaryModel], db.query(DictionaryModel).all())
        if not dictionaries:
            raise HTTPException(status_code=404, detail="No dictionaries found")
        return dictionaries

    dictionary = cast(Optional[DictionaryModel], db.query(DictionaryModel).filter(DictionaryModel.Dictionary_ID == Dictionary_ID).first())

    if not dictionary:
        raise HTTPException(status_code=404, detail="Dictionary not found")
    
    return dictionary