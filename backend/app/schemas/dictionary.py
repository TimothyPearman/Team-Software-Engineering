# app/schemas/notice.py
from pydantic import BaseModel, Field
from typing import Optional, Annotated
from datetime import datetime
from pydantic import StringConstraints

# Used when returning a full notice from the Full_Notice view.
class PlaceHolder(BaseModel):
    """base schema for a notice with all fields from the Full_Notice view as optional since some may be null"""

    class Config:
        from_attributes = True
