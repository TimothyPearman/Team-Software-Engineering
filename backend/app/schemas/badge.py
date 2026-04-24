from pydantic import BaseModel


class UserBadgeSchema(BaseModel):
    """Schema returned by GET /users/badges/get."""

    User_ID: int
    Badge_ID: int
    Name: str
    Description: str | None

    class Config:
        from_attributes = True

class BadgeSchema(BaseModel):
    """Schema returned after updating a badge record."""

    Badge_ID: int
    Name: str
    Description: str | None

    class Config:
        from_attributes = True