'use client';

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSearchParams } from 'next/navigation';

import CheckoutForm from '../components/CheckoutForm';
import CompletePage from '../components/CompletePage';

// Load Stripe outside of the component render to avoid re-creating the Stripe object on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const searchParams = useSearchParams();

  // Query parameters from Stripe
  const paymentIntent = searchParams.get('payment_intent');
  const clientSecret = searchParams.get('payment_intent_client_secret');
  const redirectStatus = searchParams.get('redirect_status');

  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState(clientSecret);

  // Detect whether the user is coming back after a successful payment
  useEffect(() => {
    if (redirectStatus === 'succeeded' && clientSecret) {
      setIsPaymentConfirmed(true);
    }
  }, [redirectStatus, clientSecret]);

  // Render different components based on payment status
  return (
    <div className="App">
      {isPaymentConfirmed ? (
        <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
          <CompletePage />
        </Elements>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
