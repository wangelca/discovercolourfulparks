# references : chatGPT: define the pydantic models for request validation
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    user_id: int
    spot_id: int
    event_id: int
    rating: int = Field(..., ge=1, le=5)
    review: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True