from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Review  # Ensure the Review model is imported
from database import get_db  # Database session dependency
from pydantic import BaseModel, Field
from datetime import datetime

# Define Pydantic models for request and response validation
class ReviewBase(BaseModel):
    id: int
    spot_id: Optional[int] = None
    event_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    review: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    reviewId: int
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Initialize the API router
router = APIRouter()

# CRUD function for creating a review
def create_review(db: Session, review: ReviewCreate):
    db_review = Review(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

# CRUD function for getting reviews by item type and ID
def get_reviews_by_item(db: Session, item_id: int, item_type: str):
    if item_type == "spot":
        return db.query(Review).filter(Review.spot_id == item_id).all()
    elif item_type == "event":
        return db.query(Review).filter(Review.event_id == item_id).all()
    else:
        raise HTTPException(status_code=400, detail="Invalid item type")

# CRUD function for calculating average rating
def get_average_rating(db: Session, item_id: int, item_type: str):
    if item_type == "spot":
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.spot_id == item_id).scalar()
    elif item_type == "event":
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.event_id == item_id).scalar()
    else:
        raise HTTPException(status_code=400, detail="Invalid item type")
    return avg_rating

# API Route to add a new review
@router.post("/reviews", response_model=ReviewResponse)
def add_review(review: ReviewCreate, db: Session = Depends(get_db)):
    return create_review(db=db, review=review)

# API Route to get reviews by item type and item ID
@router.get("/reviews/{item_type}/{item_id}", response_model=List[ReviewResponse])
def get_reviews(item_type: str, item_id: int, db: Session = Depends(get_db)):
    return get_reviews_by_item(db=db, item_id=item_id, item_type=item_type)

# API Route to get the average rating of an item by item type and item ID
@router.get("/ratings/{item_type}/{item_id}")
def get_average_rating_endpoint(item_type: str, item_id: int, db: Session = Depends(get_db)):
    avg_rating = get_average_rating(db=db, item_id=item_id, item_type=item_type)
    return {"average_rating": avg_rating}
