from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Notification
from email.message import EmailMessage
import aiosmtplib
import os

router = APIRouter()

# Pydantic model for request validation
class NotificationRequest(BaseModel):
    email: str
    message: str

# Function to send the email (runs in the background)
async def send_email(to_email: str, subject: str, body: str):
    message = EmailMessage()
    message["From"] = "wuiyit@hotmail.com"
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    await aiosmtplib.send(
        message,
        hostname="smtp.gmail.com",
        port=465,
        password=os.getenv("EMAIL_PASSWORD"),
        use_tls=True
    )

# Create notification and send email in background
@router.post("/notifications")
async def create_notification(notification_req: NotificationRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    notification = Notification(
        email=notification_req.email,
        message=notification_req.message,
        status="pending",
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)

    # Add the email sending task to background tasks
    background_tasks.add_task(send_email, notification_req.email, "New Notification", notification_req.message)

    # Update status after email sending
    notification.status = "sent"
    db.commit()

    return {"status": "Notification created", "notification_msgId": notification.msgId}


#Refrence: https://mailmug.net/blog/fastapi-mail/