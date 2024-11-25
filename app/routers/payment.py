from fastapi import FastAPI, HTTPException, Request, APIRouter
from pydantic import BaseModel
import stripe
import os

router = APIRouter()

# Set up Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Models for request payload
class Item(BaseModel):
    id: str
    amount: int

class CreatePaymentIntentRequest(BaseModel):
    items: list[Item]

@router.post("/create-payment-intent")
async def create_payment_intent(request: CreatePaymentIntentRequest):
    try:
        # Calculate tax and total amount
        items = request.items
        total_amount = sum(item.amount for item in items)

        # Create a PaymentIntent
        payment_intent = stripe.PaymentIntent.create(
            amount=total_amount,
            currency="cad",
            automatic_payment_methods={"enabled": True},
        )
        return {"clientSecret": payment_intent["client_secret"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#Reference: https://docs.stripe.com/payments/quickstart?client=next&lang=python