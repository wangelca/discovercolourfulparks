from sqlalchemy import func
from sqlalchemy.orm import Session
from .models import Review
from .schemas import ReviewCreate

def create_review(db: Session, review: ReviewCreate):
    db_review = Review(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


def get_reviews_by_item(db: Session, item_id: int, item_type: str):
    if item_type == "spot":
        return db.query(Review).filter(Review.spot_id == item_id, Review.type == "spot").all()
    elif item_type == "event":
        return db.query(Review).filter(Review.event_id == item_id, Review.type == "event").all()

def get_average_rating(db: Session, item_id: int, item_type: str):
    if item_type == "spot":
        return db.query(func.avg(Review.rating)).filter(Review.spot_id == item_id, Review.type == "spot").scalar()
    elif item_type == "event":
        return db.query(func.avg(Review.rating)).filter(Review.event_id == item_id, Review.type == "event").scalar()