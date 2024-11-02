from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, WebSocket
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Notification, User, Booking
from email.message import EmailMessage
from typing import Optional, List
from datetime import datetime
import aiosmtplib
import os
import asyncio 

router = APIRouter()

# Pydantic model for request validation
class NotificationRequest(BaseModel):
    email: str
    message: str


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
    recipients = notification_req.email
    message = notification_req.message

    user = db.query(User).filter(User.email == notification_req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create a new notification in the database
    notification = Notification(
        email=user.email,
        message=notification_req.message,
        status="pending",
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


@router.post("/notifications/user-to-admin")
async def user_to_admin_notification(
    notification_req: NotificationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Retrieve user email based on ID (assuming user ID is in notification_req)
    user = db.query(User).filter(User.id == notification_req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Send email to admin
    background_tasks.add_task(send_email, "wuiyitang@gmail.com", "User Notification", notification_req.message)

    return {"status": "Notification sent to admin"}


@router.websocket("/ws/notifications/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, db: Session = Depends(get_db)):
    await websocket.accept()
    while True:
        # Fetch unread notifications count for user
        count = db.query(Notification).filter(Notification.user_id == user_id, Notification.status == "unread").count()
        await websocket.send_json({"unread_count": count})
        await asyncio.sleep(10)  # Adjust the interval as needed


@router.get("/notifications/{user_id}")
async def get_notifications(user_id: int, db: Session = Depends(get_db)):
    notifications = db.query(Notification).filter(Notification.user_id == user_id).all()
    return notifications


@router.get("/users/search-email")
async def search_email(query: str, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.email.ilike(f"%{query}%")).all()
    return [{"email": user.email, "username": user.username} for user in users]


#Refrence: https://mailmug.net/blog/fastapi-mail/