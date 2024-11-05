# app/routers/users.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
import os
import httpx
import json

router = APIRouter()


CLERK_API_URL = "https://api.clerk.com/v1"
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

# Helper function to update public metadata
async def update_user_metadata(user_id: str, metadata: str):
    async with httpx.AsyncClient() as client:
        response = await client.patch(
            f"{CLERK_API_URL}/users/{user_id}/metadata",
            json={"public_metadata": metadata},
            headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to update user metadata")

@router.get("/sync-users")
async def sync_users(db: Session = Depends(get_db)):
    try:

        if not CLERK_SECRET_KEY:
            print("Error: CLERK_SECRET_KEY is missing.")
            raise HTTPException(status_code=500, detail="CLERK_SECRET_KEY is not set.")
        
        users = []

        # Fetch users from Clerk API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CLERK_API_URL}/users?limit=500&offset=0&order_by=-created_at",
                headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"}
            )
            response.raise_for_status()  # Ensure HTTP errors are caught
            users = response.json()

        # Loop through users and sync with the database
        for user_data in users:

            clerk_user_id = user_data["id"]
            email = user_data["email_addresses"][0]["email_address"] if user_data["email_addresses"] else ""
            public_metadata = user_data.get("public_metadata", {"role": "visitor"})

            public_metadata_str = json.dumps(public_metadata)

            # Update Clerk metadata if the user does not have a role
            if "role" not in public_metadata:
                await update_user_metadata(clerk_user_id, {"role": "visitor"})
                public_metadata["role"] = "visitor"

            # Check if the user already exists in the database
            db_user = db.query(User).filter(
                (User.clerk_user_id == clerk_user_id) | (User.email == email)
            ).first()

            if db_user:
                db_user.email = email
                db_user.publicMetadata = public_metadata_str
            else:
                new_user = User(
                    clerk_user_id=clerk_user_id,
                    email=email,
                    phoneNumber=user_data.get("phone_number", ""),
                    publicMetadata=public_metadata_str,
                    firstName=user_data.get("first_name", ""),
                    lastName=user_data.get("last_name", ""),
                    username=user_data.get("username", ""),
                    mktPref=user_data.get("marketing_preferences", False),
                    favSpotId=user_data.get("favorite_spot_ids", []),
                    favEventId=user_data.get("favorite_event_ids", [])
                )
                db.add(new_user)

        db.commit()  # Commit all changes
        print("Users synced successfully.")
        return {"message": "Users synced successfully"}

    except Exception as e:
        print("General error in sync-users:", str(e))
        raise HTTPException(status_code=500, detail=f"Error syncing users: {str(e)}")