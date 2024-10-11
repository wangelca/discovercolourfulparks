from pydantic import BaseModel
from typing import Optional

class SpotReviewBase(BaseModel):
    spot_id: int
    user_id: int
    rating: int
    review: Optional[str] = None

class EventReviewBase(BaseModel):
    event_id: int
    user_id: int
    rating: int
    review: Optional[str] = None

class SpotReviewCreate(SpotReviewBase):
    pass

class EventReviewCreate(EventReviewBase):
    pass

class SpotReview(SpotReviewBase):
    id: int
    created_at: str
    updated_at: str

class EventReview(EventReviewBase):
    id: int
    created_at: str
    updated_at: str

