from typing import Optional, cast

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.level import Level as LevelModel

def get_level(db: Session, level_id: int | None = None) -> LevelModel | list[LevelModel]:
    """Get all levels, or a specific level when level_id is provided."""
    if level_id is not None:
        level = cast(Optional[LevelModel], db.query(LevelModel).filter(LevelModel.Level_ID == level_id).first())
        if not level:
            raise HTTPException(status_code=404, detail="Level not found")
        return level

    levels = cast(list[LevelModel], db.query(LevelModel).all())
    if not levels:
        raise HTTPException(status_code=404, detail="No levels found")

    return levels