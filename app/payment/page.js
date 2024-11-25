'use client'

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";

import CheckoutForm from "../components/CheckoutForm";
import CompletePage from "../components/CompletePage";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function App() {
  const [clientSecret, setClientSecret] = React.useState("");
  const [dpmCheckerLink, setDpmCheckerLink] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);

  const searchParams = useSearchParams();
  const fee = searchParams.get("fee");
  const itemName = searchParams.get("itemName");
  const eventId = searchParams.get("eventId");
  const bookingDate = searchParams.get("bookingDate");
  const adults = searchParams.get("adults");
  const kids = searchParams.get("kids");
  const id = searchParams.get("id");
  const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");

  const redirectStatus = searchParams.get("redirect_status");

  React.useEffect(() => {
    // If the user is redirected after payment, show CompletePage
    if (paymentIntentClientSecret && redirectStatus === "succeeded") {
      setConfirmed(true);
    }
  }, [paymentIntentClientSecret, redirectStatus]);


  React.useEffect(() => {
    // Create PaymentIntent as soon as the page loads, if not already confirmed
    if (!confirmed) {
      fetch("http://localhost:8000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: itemName, amount: parseFloat(fee) * 100 }] }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        });
    }
  }, [fee, itemName, confirmed]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {confirmed ? (
        clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CompletePage />
          </Elements>
        )
      ) : (
        clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm
              fee={fee}
              itemName={itemName}
              eventId={eventId}
              bookingDate={bookingDate}
              adults={adults}
              kids={kids}
              id={id}
            />
          </Elements>
        )
      )}
    </div>
  );
}