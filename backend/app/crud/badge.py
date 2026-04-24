from typing import Any, cast

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.badge import Badge as BadgeModel
from ..models.badge import UserBadges as UserBadgesModel


def get_user_badges(db: Session, user_id: int) -> list[UserBadgesModel]:
    """Get all badge rows linked to a user."""
    user_badges = cast(
        list[UserBadgesModel],
        db.query(UserBadgesModel).filter(UserBadgesModel.User_ID == user_id).all(),
    )

    if not user_badges:
        raise HTTPException(status_code=404, detail="No badges found for user")

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


def update_badge(db: Session, badge_id: int) -> BadgeModel:
    """Update a badge record."""
    badge = get_badge_by_id(db, badge_id)
    badge_row = cast(Any, badge)

    badge_row.Name = name
    badge_row.Description = description

    db.commit()
    db.refresh(badge)

    return badge