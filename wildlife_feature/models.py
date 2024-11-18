from sqlalchemy import Column, Integer, String, Float, TIMESTAMP
from database import Base

class WildlifeSighting(Base):
    __tablename__ = "wildlife_sightings"
    
    id = Column(Integer, primary_key=True, index=True)
    animal_type = Column(String, index=True)
    description = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    sighting_time = Column(TIMESTAMP)
    reported_by = Column(String)
    image_url = Column(String)
