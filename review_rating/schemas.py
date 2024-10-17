from pydantic import BaseModel
from typing import Optional

class ReviewBase(BaseModel):
    rating: float
    comment: str
    event_id: Optional[int]
    spot_id: Optional[int]

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int

    class Config:
        orm_mode = True