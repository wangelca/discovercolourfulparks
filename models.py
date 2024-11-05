from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone
from enum import Enum
from typing import List, Tuple

# Enum for booking status
class BookingStatus(str, Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    CANCELED = "Canceled"

class User(Base):
    __tablename__ = 'user'
    
    id = Column(Integer, primary_key=True, index=True)
    clerk_user_id = Column(String, unique=True, index=True)
    username = Column(String, index=True, nullable=True)
    email = Column(String, unique=True, index=True)
    firstName = Column(String, nullable=True)
    lastName = Column(String, nullable=True)
    phoneNumber = Column(String, nullable=True)
    publicMetadata = Column(String, nullable=True)
    mktPref = Column(Boolean, default = False)
    favSpotId = Column(ARRAY(Integer), nullable=True)
    favEventId = Column(ARRAY(Integer), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, onupdate=datetime.utcnow, nullable=True)
    
    booking = relationship("Booking", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    notifications = relationship("Notification", back_populates="user_notifications")
    reviews = relationship("Review", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"

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
    events = relationship("Event", back_populates="park")
    

    def __repr__(self):
        return f"<Park(parkId={self.parkId}, name={self.name}, province={self.province})>"
    

class Spot(Base):
    __tablename__ = 'spot'
    
    spotId = Column(Integer, primary_key=True, index=True)
    parkId = Column(Integer, ForeignKey('park.parkId'))
    spotName = Column(String)
    spotDescription = Column(String)  
    spotAdmission = Column(Float)
    spotDiscount = Column(Float)
    spotLocation = Column(String)
    category = Column(String)
    spotImageUrl = Column(ARRAY(String), nullable=True)
    parameters = Column(String, nullable=True)
    requiredbooking = Column(Boolean, default=False)
    openingHour = Column(String)
    closingHour = Column(String)
    spotLimit = Column(Integer)
    reviews = relationship("Review", back_populates="spot")  # Link to Review
    
    park = relationship("Park", back_populates="spots")
    booking = relationship("Booking", back_populates="spot")

    def __repr__(self):
        return f"<Spot(spotId={self.spotId}, spotName={self.spotName}, parkId={self.parkId})>"

class Event(Base):
    __tablename__ = 'event'
    
    eventId = Column(Integer, primary_key=True, index=True)
    parkId = Column(Integer, ForeignKey('park.parkId'))
    eventName = Column(String)
    eventLocation = Column(String)
    fee = Column(Float)
    description = Column(String)
    discount = Column(Float)
    startDate = Column(DateTime)
    endDate = Column(DateTime)
    eventImageUrl = Column(ARRAY(String))
    parameters = Column(String, nullable=True)
    requiredbooking = Column(Boolean, default=False)
    
    park = relationship("Park", back_populates="events") 
    booking = relationship("Booking", back_populates="event")
    reviews = relationship("Review", back_populates="event")  # Link to Review

    def __repr__(self):
        return f"<Event(eventId={self.eventId}, eventName={self.eventName}, parkId={self.parkId})>"

class Booking(Base):
    __tablename__ = 'booking'
    
    bookingId = Column(Integer, primary_key=True, index=True)
    eventId = Column(Integer, ForeignKey('event.eventId'), nullable=True)
    id = Column(Integer, ForeignKey('user.id'))
    spotId = Column(Integer, ForeignKey('spot.spotId'), nullable=True)  # Optional spot
    bookingDate = Column(DateTime, default=datetime.utcnow)
    bookingStatus = Column(String, default=BookingStatus.PENDING.value)
    paymentAmount = Column(Float, nullable=True)  # Amount paid (or None for free events)
    adults = Column(Integer)
    kids = Column(Integer)
    
    user = relationship("User", back_populates="booking")
    event = relationship("Event", back_populates="booking")
    spot = relationship("Spot", back_populates="booking")
    payment = relationship("Payment", back_populates="booking", uselist=False)

    def __repr__(self):
        return f"<Booking(bookingId={self.bookingId}, eventId={self.eventId}, userId={self.id})>"

class Payment(Base):
    __tablename__ = 'payments'
    
    paymentId = Column(Integer, primary_key=True, index=True)
    bookingId = Column(Integer, ForeignKey('booking.bookingId'))
    id = Column(Integer, ForeignKey('user.id'))
    paymentStatus = Column(String)
    
    booking = relationship("Booking", back_populates="payment")
    user = relationship("User", back_populates="payments")

    def __repr__(self):
        return f"<Payment(paymentId={self.paymentId}, bookingId={self.bookingId}, userId={self.id})>"
    

class Notification(Base):
    __tablename__ = "notifications"

    msgId = Column(Integer, primary_key=True, index=True)
    id = Column(Integer)
    email = Column(String, ForeignKey("user.email"))
    message = Column(String)
    status = Column(String, default="unread")
    created_at = Column(DateTime, default=datetime.utcnow)

    user_notifications = relationship("User", back_populates="notifications")

    
class Review(Base):
    __tablename__ = 'reviews'

    reviewId = Column(Integer, primary_key=True, index=True)
    rating = Column(Float, nullable=False)
    review = Column(String, nullable=True)
    event_id = Column(Integer, ForeignKey("event.eventId"), nullable=True)
    id = Column(Integer, ForeignKey('user.id'))
    spot_id = Column(Integer, ForeignKey('spot.spotId'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    event = relationship("Event", back_populates="reviews")
    spot = relationship("Spot", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

