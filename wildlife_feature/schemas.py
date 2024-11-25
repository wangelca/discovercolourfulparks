from pydantic import BaseModel
from datetime import datetime

class WildlifeSightingBase(BaseModel):
    animal_type: str
    description: str = None
    latitude: float
    longitude: float
    sighting_time: datetime = None
    reported_by: str = None
    image_url: str = None

class WildlifeSightingCreate(WildlifeSightingBase):
    pass

class WildlifeSightingResponse(WildlifeSightingBase):
    id: int

    class Config:
        orm_mode = True
