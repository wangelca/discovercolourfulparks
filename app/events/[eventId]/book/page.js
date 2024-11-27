"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../../components/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function EventBookingPage({}) {
  const { eventId } = useParams(); // Get dynamic route params
  const { isLoaded, isSignedIn, user } = useUser(); // Access loading and sign-in state
  const [event, setEvent] = useState(null);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [bookingDate, setBookingDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [errors, setErrors] = useState({
    adults: "",
    kids: "",
    bookingDate: "",
  });
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
  });
  const [adultError, setAdultError] = useState("");
  const [kidError, setKidError] = useState("");
  const [dateError, setDateError] = useState("");

  const formatEventDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Format the date and time separately
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };

    const formattedstartDate = start.toLocaleDateString(undefined, dateOptions);
    const formattedendtDate = end.toLocaleDateString(undefined, dateOptions);
    const formattedStartTime = start.toLocaleTimeString(undefined, timeOptions);
    const formattedEndTime = end.toLocaleTimeString(undefined, timeOptions);

    // Return formatted date and time
    return `${formattedstartDate}, ${formattedStartTime} - ${formattedendtDate}, ${formattedEndTime}`;
  };

  useEffect(() => {
    // Fetch event details
    fetch(`http://localhost:8000/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((error) => console.error("Error fetching event:", error));
  }, [eventId]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return; // Ensure user is loaded and signed in
    fetch(`http://localhost:8000/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch((error) =>
        console.error("Error fetching profile detaisl:", error)
      );
  }, [user, isLoaded, isSignedIn]);

  useEffect(() => {
    if (event) calculateFee();
  }, [adults, kids, event]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  const calculateFee = () => {
    if (!event) {
      return;
    }

    const gst = 0.05;
    const feeWithoutGst = adults * event.fee; // Only adults are charged
    const gstAmount = feeWithoutGst * gst;
    setPaymentAmount(feeWithoutGst + gstAmount);
  };

  const validateBooking = () => {
    const newErrors = {};
    if (adults <= 0) newErrors.adults = "Please select at least one adult.";
    if (kids > 0 && adults === 0) newErrors.kids = "At least one adult is required for kids.";
    if (!bookingDate) {
      newErrors.bookingDate = "Please select a booking date.";
    } else {
      const bookingDateObj = new Date(bookingDate);
      const eventStartDate = new Date(event.startDate.split("T")[0]);
      const eventEndDate = new Date(event.endDate.split("T")[0]);
      if (bookingDateObj < eventStartDate || bookingDateObj > eventEndDate) {
        newErrors.bookingDate = "Booking date must be within the event date range.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleValidateAndShowPayment = async () => {
    if (!validateBooking()) return;

    try {
      const res = await fetch("http://localhost:8000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: event.eventName, amount: paymentAmount * 100 }] }),
      });

      const { clientSecret } = await res.json();
      setClientSecret(clientSecret);
      setShowPaymentSection(true);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div>
        {event ? (
          <div className="max-w-lg mx-auto  p-6 rounded-lg bg-gray-200 bg-opacity-60"> 
            <h1 className="text-3xl font-bold mb-4">Book {event.eventName}</h1>
            <p>
              <strong>Location:</strong> {event.eventLocation}
            </p>
            <p>
              <strong>Admission Fee:</strong> ${event.fee}
            </p>
            <p>
              <strong>Event Date:</strong>{" "}
              {formatEventDate(event.startDate, event.endDate)}
            </p>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Your Information</h2>
              <p>Email: {profileData.email}</p>
              <p>
                Name: {profileData.firstName} {profileData.lastName}
              </p>
              <p>Phone: {profileData.phoneNumber}</p>
            </div>

            <div className="mt-6">
              <p>
                <label>Adults:</label>
                <input
                  type="number"
                  value={adults}
                  onChange={(e) => {
                    setAdults(Number(e.target.value));
                    calculateFee();
                  }}
                  className="border rounded p-2 m-2"
                  min={0}
                />
                {adultError && (
                  <p className="p-2 error-message shadow-info-3">
                    {adultError}
                  </p>
                )}
              </p>
              <p>
                <label>Kids (below 12):</label>
                <input
                  type="number"
                  value={kids}
                  onChange={(e) => {
                    setKids(Number(e.target.value));
                    calculateFee();
                  }}
                  className="border rounded p-2 m-2"
                  min={0}
                />
                {kidError && (
                  <p className="p-2 error-message shadow-info-3">{kidError}</p>
                )}
              </p>
              <p>
                <label>Booking Date:</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="border rounded p-2 m-2"
                  min={event.startDate} // Prevents past dates from being selected
                  max={event.endDate} // Prevents booking after event end date
                />
                {dateError && (
                  <p className="p-2 error-message shadow-info-3">{dateError}</p>
                )}
              </p>

              <p>
                <strong>Total Fee (include 5% GST):</strong> $
                {paymentAmount.toFixed(2)}
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={handleValidateAndShowPayment}
                className="bg-green-500 text-white py-2 px-4 rounded self-center"
              >
                Validate and proceed to payment
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-3xl text-gray-500 py-20">Loading event details...</div>
        )}
      </div>

      {showPaymentSection && clientSecret && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg transition-all transform translate-y-0">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              fee={paymentAmount}
              itemName={event.eventName}
              itemId={eventId}
              type="event"
              bookingDate={bookingDate}
              adults={adults}
              kids={kids}
              id={profileData.id}
              email={profileData.emailAddress}
            />
          </Elements>
        </div>
      )}
    </div>
  );
}
