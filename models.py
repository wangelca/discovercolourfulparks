from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = 'user'
    
    id = Column(Integer, primary_key=True, index=True)
    clerk_user_id = Column(String, unique=True, index=True)
    username = Column(String, index=True, nullable=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    public_metadata = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.datetime.utcnow)
    
    bookings = relationship("Booking", back_populates="user")
    payments = relationship("Payment", back_populates="user")


class Park(Base):
    __tablename__ = 'park'
    
    parkId = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    province = Column(String, nullable=True)
    description = Column(String)
    location = Column(String)
    parkImageUrl = Column(ARRAY(String))
    parameters = Column(String, nullable=True)
    
    spots = relationship("Spot", back_populates="park")
    events = relationship("Event", back_populates="park")  # Fix: Park has many events


class Spot(Base):
    __tablename__ = 'spot'
    
    spotId = Column(Integer, primary_key=True, index=True)
    parkId = Column(Integer, ForeignKey('park.parkId'))
    spot_name = Column(String)
    spot_description = Column(String)
    spot_hourly_rate = Column(Float)
    spot_discount = Column(Float)
    spot_location = Column(String)
    spot_image_url = Column(ARRAY(String))
    parameters = Column(String, nullable=True)
    required_booking = Column(Boolean, default=False)
    
    park = relationship("Park", back_populates="spots")
    bookings = relationship("Booking", back_populates="spot")


class Event(Base):
    __tablename__ = 'event'
    
    eventId = Column(Integer, primary_key=True, index=True)
    parkId = Column(Integer, ForeignKey('park.parkId'))
    event_name = Column(String)
    event_location = Column(String)
    fee = Column(Float)
    description = Column(String)
    discount = Column(Float)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    
    park = relationship("Park", back_populates="events")  # Fix: Events belong to a park
    bookings = relationship("Booking", back_populates="event")


class Booking(Base):
    __tablename__ = 'bookings'
    
    bookingId = Column(Integer, primary_key=True, index=True)
    eventId = Column(Integer, ForeignKey('event.eventId'))
    id = Column(Integer, ForeignKey('user.id'))
    spotId = Column(Integer, ForeignKey('spot.spotId'))
    booking_date = Column(DateTime)
    booking_status = Column(String)
    booking_start_time = Column(DateTime)
    
    user = relationship("User", back_populates="bookings")
    event = relationship("Event", back_populates="bookings")
    spot = relationship("Spot", back_populates="bookings")
    payment = relationship("Payment", back_populates="booking", uselist=False)


class Payment(Base):
    __tablename__ = 'payments'
    
    paymentId = Column(Integer, primary_key=True, index=True)
    bookingId = Column(Integer, ForeignKey('bookings.bookingId'))
    id = Column(Integer, ForeignKey('user.id'))
    payment_status = Column(String)
    
    booking = relationship("Booking", back_populates="payment")
    user = relationship("User", back_populates="payments")
