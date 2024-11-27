from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, WebSocket
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from database import get_db
from models import Notification, User, Booking
from email.message import EmailMessage
from typing import Optional, List
from datetime import datetime
import aiosmtplib
import os
import json

router = APIRouter()

class NotificationRequest(BaseModel):
    id: int
    email: str
    message: str

class NotificationStatusUpdate(BaseModel):
    status: str

# Request model for creating a booking
class BookingConfirmationRequest(BaseModel):
    eventId: int
    bookingDate: datetime
    adults: int
    kids: int
    paymentAmount: float
    id: int
    email: Optional[str] = None

# Function to send the email (runs in the background)
async def send_email(to_email: str, subject:str, body: str):
    try:
        message = EmailMessage()
        message["From"] = "wuiyitang@gmail.com"
        message["To"] = to_email
        message["Subject"] = "Message from DCP's Admin"
        message.set_content(body)

        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 10px; color: #333;">
            <h2 style="color: #4CAF50;">Notification Alert</h2>
            <p>{body}</p>
            <footer style="margin-top: 20px; font-size: 0.9em;">
                <p>Best Regards,</p>
                <p>Discover Colorful Parks</p>
            </footer>
        </body>
        </html>
        """
        message.add_alternative(html_content, subtype='html')

        await aiosmtplib.send(
            message,
            hostname="smtp.gmail.com",
            port=465,
            username="wuiyitang@gmail.com",
            password=os.getenv("EMAIL_PASSWORD"),
            use_tls=True
        )
        print(f"Email sent successfully to: {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")


# Create notification and send email in background
@router.post("/notifications/admin-to-user")
async def admin_create_notification(
    notification_req: NotificationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    recipient_id = notification_req.id
    recipients = notification_req.email
    message = notification_req.message

    user = db.query(User).filter(User.email == notification_req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create a new notification in the database
    notification = Notification(
        email=user.email,
        message=notification_req.message,
        status="unread",
        id=recipient_id,
        created_at=datetime.utcnow()
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)

    # Send email in the background
    background_tasks.add_task(send_email, user.email, "Notification Alert", notification_req.message)

    # Update the status of the notification to "sent"
    notification.status = "unread"
    db.commit()

    return {"status": "Notification sent", "notification_id": notification.msgId}

# Function to send the email (runs in the background)
async def send_booking_confirmation_email(to_email: str, subject: str, body: str):
    try:

        # Generate plain text content from the dictionary
        plain_text_body = (
            f"Dear {body['user_name']},\n\n"
            f"Your booking has been successfully confirmed!\n\n"
            f"Booking Details:\n"
            f"- Event ID: {body['event_id']}\n"
            f"- Booking Date: {body['booking_date']}\n"
            f"- Adults: {body['adults']}\n"
            f"- Kids: {body['kids']}\n"
            f"- Total Payment: ${body['payment_amount']:.2f}\n\n"
            "Thank you for choosing Discover Colorful Parks. We look forward to seeing you at the event!\n\n"
            "Best Regards,\nDiscover Colorful Parks Team"
        )
        
        message = EmailMessage()
        message["From"] = "wuiyitang@gmail.com"
        message["To"] = to_email
        message["Subject"] = subject
        message.set_content(plain_text_body)

        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <header style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Booking Confirmation</h1>
                </header>
                <main style="padding: 20px;">
                    <p style="margin: 0 0 16px;">Dear <strong>{body['user_name']}</strong>,</p>
                    <p style="margin: 0 0 16px;">Your booking has been successfully confirmed!</p>
                    <h2 style="margin-bottom: 16px;">Booking Details:</h2>
                    <ul style="padding-left: 20px; margin: 0;">
                        <li><strong>Event ID:</strong> {body['event_id']}</li>
                        <li><strong>Booking Date:</strong> {body['booking_date']}</li>
                        <li><strong>Adults:</strong> {body['adults']}</li>
                        <li><strong>Kids:</strong> {body['kids']}</li>
                        <li><strong>Total Payment:</strong> ${body['payment_amount']:.2f}</li>
                    </ul>
                    <p style="margin-top: 16px;">
                        Thank you for choosing Discover Colorful Parks. We look forward to seeing you at the event!
                    </p>
                </main>
                <footer style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 0.8em;">
                    <p style="margin: 0;">Discover Colorful Parks Team</p>
                    <p style="margin: 0;">Contact us at using in-app inbox.</a></p>
                </footer>
            </div>
        </body>
        </html>
        """
        message.add_alternative(html_content, subtype="html")

        await aiosmtplib.send(
            message,
            hostname="smtp.gmail.com",
            port=465,
            username="wuiyitang@gmail.com",
            password=os.getenv("EMAIL_PASSWORD"),
            use_tls=True,
        )
        print(f"Booking confirmation email sent successfully to: {to_email}")
    except Exception as e:
        print(f"Failed to send booking confirmation email to {to_email}: {e}")

# API to confirm booking and send email
@router.post("/event-bookings/confirm")
async def confirm_booking(
    booking_request: BookingConfirmationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    try:
          # Prepare email content
        user = db.query(User).filter(User.id == booking_request.id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        booking = Booking(
            eventId=booking_request.eventId,
            id=booking_request.id,
            bookingDate=booking_request.bookingDate,
            bookingStatus="confirmed",
            adults=booking_request.adults,
            kids=booking_request.kids,
            paymentAmount=booking_request.paymentAmount,
            spotId=None,  # Not relevant for event bookings
        )
        db.add(booking)

        
        email_subject = f"DCP Booking Confirmation: Event ID {booking_request.eventId}"
        email_body = {
            "user_name": f"{user.firstName} {user.lastName}",
            "event_id": booking_request.eventId,
            "booking_date": booking_request.bookingDate.strftime('%Y-%m-%d'),
            "adults": booking_request.adults,
            "kids": booking_request.kids,
            "payment_amount": booking_request.paymentAmount,
        }
        to_email = booking_request.email or user.email

        # Schedule email sending in the background
        background_tasks.add_task(
            send_booking_confirmation_email, to_email, email_subject, email_body
        )

        # Create a notification
        notification = Notification(
            email=to_email,
            message=json.dumps(email_body),  # Convert dict to JSON string
            status="unread",
            id=booking_request.id,
            created_at=datetime.utcnow(),
        )
        db.add(notification)

        # Commit the transaction
        db.commit()

        return {
            "status": "Booking confirmed and email sent",
            "booking_id": booking.bookingId,
            "notification_id": notification.msgId,
        }

    except SQLAlchemyError as e:
        db.rollback()  # Rollback if any error occurs
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.post("/notifications/user-to-admin")
async def user_to_admin_notification(
    notification_req: NotificationRequest,
    db: Session = Depends(get_db)
):
     # Retrieve user based on provided ID
    user = db.query(User).filter(User.email == notification_req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create a notification for the admin
    notification = Notification(
        email="wuiyitang@gmail.com",  # Admin email address
        message=notification_req.message,
        status="unread",
        id="92",
        created_at=datetime.utcnow()
    )
    db.add(notification)
    db.commit()

    return {"status": "Notification successfully added to the database"}


@router.get("/notifications/unread-count/{user_id}")
async def get_unread_notification_count(user_id: int, db: Session = Depends(get_db)):
    count = db.query(Notification).filter(
        Notification.id == user_id,
        Notification.status == "unread"
    ).count()
    return {"unread_count": count}


@router.get("/notifications/{user_id}")
async def get_notifications(user_id: int, db: Session = Depends(get_db)):
    notifications = db.query(Notification).filter(Notification.id == user_id).all()
    return notifications


@router.get("/users/search-email")
async def search_email(query: str, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.email.ilike(f"%{query}%")).all()
    return [{"email": user.email, "id": user.id} for user in users]

# Update notification status to read or unread
@router.put("/notifications/{msgId}")
async def update_notification_status(msgId: int, status_update: NotificationStatusUpdate, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.msgId == msgId).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.status = status_update.status
    db.commit()
    return {"status": "Notification updated", "msgId": notification.msgId}

#Refrence: https://mailmug.net/blog/fastapi-mail/