# references : ChatGPT: create the fastAPI routes to submit reviews and retrieve them
from typing import List
from fastapi import APIRouter, Depends, HTTPException, FastAPI
from sqlalchemy.orm import Session
from .schemas import ReviewCreate, ReviewResponse
from .models import Review
from .crud import create_review, get_reviews_by_item, get_average_rating
from .database import get_db

app = FastAPI()

router = APIRouter()

@router.post("/reviews/", response_model=ReviewResponse)
def add_review(review: ReviewCreate, db: Session = Depends(get_db)):
    return create_review(db=db, review=review)

@router.get("/reviews/{item_type}/{item_id}", response_model=List[ReviewResponse])
def get_reviews(item_type: str, item_id: int, db: Session = Depends(get_db)):
    return get_reviews_by_item(db=db, item_id=item_id, item_type=item_type)

@router.get("/ratings/{item_type}/{item_id}")
def get_average_rating(item_type: str, item_id: int, db: Session = Depends(get_db)):
    avg_rating = get_average_rating(db=db, item_id=item_id, item_type=item_type)
    return {"average_rating": avg_rating}
