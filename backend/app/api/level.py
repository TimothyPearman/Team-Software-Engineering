from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..crud import level as level_crud
from ..db.session import get_db
from ..schemas.level import LevelSchema as Level

# Create a router for all level-related endpoints.
router = APIRouter(
    prefix="/levels",
    tags=["levels"],
)

"""
GET Endpoints:
"""
@router.get("/get", response_model=List[Level] | Level, summary="?")
async def get_data(Level_ID: int | None = None, db: Session = Depends(get_db)):
    """Return one level by id, or all levels when no id is provided."""
    level = level_crud.get_level(db, Level_ID)
    return level
