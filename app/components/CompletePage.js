import React from "react";
import { useStripe } from "@stripe/react-stripe-js";

const STATUS_CONTENT_MAP = {
  succeeded: {
    text: "Payment succeeded",
    iconColor: "#30B130",
    icon: (
      <svg
        width="16"
        height="14"
        viewBox="0 0 16 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.4695 0.232963C15.8241 0.561287 15.8454 1.1149 15.5171 1.46949L6.14206 11.5945C5.97228 11.7778 5.73221 11.8799 5.48237 11.8748C5.23253 11.8698 4.99677 11.7582 4.83452 11.5681L0.459523 6.44311C0.145767 6.07557 0.18937 5.52327 0.556912 5.20951C0.924454 4.89575 1.47676 4.93936 1.79051 5.3069L5.52658 9.68343L14.233 0.280522C14.5613 -0.0740672 15.1149 -0.0953599 15.4695 0.232963Z"
          fill="white"
        />
      </svg>
    ),
  },
  processing: {
    text: "Your payment is processing.",
    iconColor: "#6D6E78",
    icon: <div>Processing Icon</div>,
  },
  requires_payment_method: {
    text: "Your payment was not successful, please try again.",
    iconColor: "#DF1B41",
    icon: <div>Error Icon</div>,
  },
  default: {
    text: "Something went wrong, please try again.",
    iconColor: "#DF1B41",
    icon: <div>Error Icon</div>,
  },
};

export default function CompletePage() {
  const stripe = useStripe();
  const [status, setStatus] = React.useState("default");
  const [bookingData, setBookingData] = React.useState(null);

  React.useEffect(() => {
    if (!stripe) return;

    // Retrieve booking data from sessionStorage
    const storedBookingData = sessionStorage.getItem("bookingData");
    const parsedBookingData = storedBookingData ? JSON.parse(storedBookingData) : null;

    if (parsedBookingData) {
      setBookingData(parsedBookingData);
      console.log("Booking data found in sessionStorage:", parsedBookingData);
    } else {
      console.error("No booking data found in sessionStorage");
    }  

    const params = new URLSearchParams(window.location.search);
    const clientSecret = params.get("payment_intent_client_secret");

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
      if (paymentIntent) {
        setStatus(paymentIntent.status);

        if (paymentIntent.status === "succeeded" && parsedBookingData) {
          try {
            await fetch("http://localhost:8000/event-bookings/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: parsedBookingData.type,
                bookingDate: parsedBookingData.bookingDate + "T00:00:00", // Ensure ISO 8601 format
                adults: parsedBookingData.adults,
                kids: parsedBookingData.kids,
                paymentAmount: parsedBookingData.fee,
                id: parsedBookingData.id,
                email: parsedBookingData.email || "", // Provide default if undefined
                ...(parsedBookingData.type === "event"
                  ? { eventId: parsedBookingData.itemId }
                  : { spotId: parsedBookingData.itemId }),
              }),
            });
          } catch (error) {
            console.error("Error confirming booking:", error);
          }
        }
      }
    });
  }, [stripe]);

  const content = STATUS_CONTENT_MAP[status] || STATUS_CONTENT_MAP["default"];

  return (
    <div id="payment-status" className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div
        id="status-icon"
        className="flex items-center justify-center w-16 h-16 mx-auto rounded-full mb-4"
        style={{ backgroundColor: content.iconColor }}
      >
        {content.icon}
      </div>
      <h2 id="status-text" className="text-xl font-bold text-center mb-4">
        {content.text}
      </h2>

      {bookingData && (
        <div id="details-table" className="mt-4 bg-gray-100 p-4 rounded shadow-md">
          <h3 className="font-bold text-lg mb-2">Booking Details</h3>
          <ul className="text-sm space-y-1">
          <li>
              <strong>{bookingData.type === "event" ? "Event" : "Spot"}:</strong> {bookingData.itemName}
            </li>
            <li>
              <strong>{bookingData.type === "event" ? "Event" : "Spot"} page:</strong>{" "}
              <a href={`/${bookingData.type}s/${bookingData.itemId}`}>View Details</a>
            </li>
            <li>
              <strong>Booking Date:</strong> {bookingData.bookingDate}
            </li>
            <li>
              <strong>Adults:</strong> {bookingData.adults}
            </li>
            <li>
              <strong>Kids:</strong> {bookingData.kids}
            </li>
            <li>
              <strong>Total Fee:</strong> ${bookingData.fee}
            </li>
          </ul>
        </div>
      )}

      <div className="actions mt-6 flex justify-between">
        <a href="/" className="text-blue-500 underline hover:text-blue-700 text-sm">
          Go to Homepage
        </a>
        <a href={`/${bookingData?.type}s`} className="text-blue-500 underline hover:text-blue-700 text-sm">
          Go to {bookingData?.type === "event" ? "Events" : "Spots"}
        </a>
      </div>
    </div>
  );
}
