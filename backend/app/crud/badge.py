from typing import Any, cast

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..models.auth import User as UserModel
from ..models.badge import Badge as BadgeModel
from ..models.badge import UserBadges as UserBadgesModel


def get_user_badges(db: Session, user_id: int, badge_id: int | None = None) -> list[UserBadgesModel]:
    """Get badge rows linked to a user, optionally filtered by badge id."""
    query = db.query(UserBadgesModel).filter(UserBadgesModel.User_ID == user_id)

    if badge_id is not None:
        query = query.filter(UserBadgesModel.Badge_ID == badge_id)

    user_badges = cast(list[UserBadgesModel], query.all())

    return user_badges


def get_badge_by_id(db: Session, badge_id: int) -> BadgeModel:
    """Get a badge record by its ID."""
    badge = cast(
        BadgeModel | None,
        db.query(BadgeModel).filter(BadgeModel.Badge_ID == badge_id).first(),
    )

    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")

    return badge


def create_user_badge(db: Session, user_id: int, badge_id: int) -> UserBadgesModel:
    """Create a badge row for a user."""
    user = cast(
        UserModel | None,
        db.query(UserModel).filter(UserModel.User_ID == user_id).first(),
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    badge = get_badge_by_id(db, badge_id)

    existing_user_badge = cast(
        UserBadgesModel | None,
        db.query(UserBadgesModel)
        .filter(UserBadgesModel.User_ID == user_id)
        .filter(UserBadgesModel.Badge_ID == badge_id)
        .first(),
    )
    if existing_user_badge:
        raise HTTPException(status_code=409, detail="User already has this badge")

    db.execute(
        text("INSERT INTO User_Badge (User_ID, Badge_ID) VALUES (:user_id, :badge_id)"),
        {"user_id": user_id, "badge_id": badge.Badge_ID},
    )
    db.commit()

    user_badge = cast(
        UserBadgesModel | None,
        db.query(UserBadgesModel)
        .filter(UserBadgesModel.User_ID == user_id)
        .filter(UserBadgesModel.Badge_ID == badge.Badge_ID)
        .first(),
    )

    if not user_badge:
        raise HTTPException(status_code=500, detail="Failed to create user badge")

    return user_badge