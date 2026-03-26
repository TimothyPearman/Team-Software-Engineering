from pydantic import BaseModel

class Token(BaseModel):
    """schema for the token response when a user logs in"""
    access_token: str
    token_type: str
    expires_in: int

class UserSchema(BaseModel):
    """schema returned by GET /users/get"""
    User_ID: int
    Username: str
    Password_Hash: str
    CurrentStreak_ID: int | None
    FavouriteBadge_ID: int | None
    Progress_ID: int | None

    class Config:
        from_attributes = True