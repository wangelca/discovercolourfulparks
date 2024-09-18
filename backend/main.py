from fastapi import FastAPI, Depends, HTTPException, Header
from prisma import Prisma
from typing import Optional

app = FastAPI()
prisma = Prisma()

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

async def verify_clerk_token(authorization: str = Header(...)):
    token = authorization.split(" ")[1]
    # Clerk SDK to verify token (Implement token verification)
    # Assuming valid token for this example
    return token

@app.get("/user/{clerk_user_id}")
async def get_user(clerk_user_id: str, valid_user=Depends(verify_clerk_token)):
    user = await prisma.user.find_unique(where={"clerk_user_id": clerk_user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
