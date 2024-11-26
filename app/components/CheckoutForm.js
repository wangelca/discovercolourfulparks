import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm({
  fee,
  itemName,
  eventId,
  bookingDate,
  adults,
  kids,
  id,
  email,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/payment",
        },
      });

      if (error) throw new Error(error.message);
    } catch (err) {
      setMessage(err.message);
      console.error("Payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        id="submit"
        disabled={isLoading || !stripe || !elements}
        className={`mt-4 w-full text-white font-semibold py-2 px-4 rounded transition ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {isLoading ? <div className="loader"></div> : "Pay Now"}
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </form>
  );
}
