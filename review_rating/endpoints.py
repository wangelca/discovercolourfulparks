from fastapi import FastAPI, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from .models import SpotReview, EventReview, SpotReviewCreate, EventReviewCreate
from .database import get_db
from review_rating import models

app = FastAPI()

@app.post("/spots/reviews/", response_model=SpotReview)
def create_spot_review(review: SpotReviewCreate, db: Session = Depends(get_db)):
    db_review = models.SpotReview(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/spots/reviews/", response_model=List[SpotReview])
def get_spot_reviews(db: Session = Depends(get_db)):
    return db.query(models.SpotReview).all()

# Similar structure for Event Reviews Endpoints
@app.post("/events/reviews/", response_model=EventReview)
def create_event_review(review: EventReviewCreate, db: Session = Depends(get_db)):
    db_review = models.EventReview(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/events/reviews/", response_model=List[EventReview])
def get_event_reviews(db: Session = Depends(get_db)):
    return db.query(models.EventReview).all()