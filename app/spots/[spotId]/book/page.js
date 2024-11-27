"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../../components/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function BookingPage() {
  const { spotId } = useParams(); // Get dynamic route params
  const router = useRouter(); // Initialize useRouter
  const { isLoaded, isSignedIn, user } = useUser(); // Access loading and sign-in state
  const [spot, setSpot] = useState(null);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [bookingDate, setBookingDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
  });
  const [adultError, setAdultError] = useState("");
  const [kidError, setKidError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    // Fetch spot details
    fetch(`http://localhost:8000/spots/${spotId}`)
      .then((res) => res.json())
      .then((data) => setSpot(data))
      .catch((error) => console.error("Error fetching spot:", error));
  }, [spotId]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return; // Ensure user is loaded and signed in
    fetch(`http://localhost:8000/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch((error) =>
        console.error("Error fetching profile details:", error)
      );
  }, [user, isLoaded, isSignedIn]);

  useEffect(() => {
    if (spot) {
      calculateFee();
    }
  }, [adults, kids]);

  const calculateFee = () => {
    if (!spot) return; // Return early if spot is not yet loaded

    const gst = 0.05;
    const totalPersons = adults + kids;

    if (totalPersons > spot.spotLimit) {
      setError("Number of persons exceeds the limit for this spot.");
      return;
    }

    const feeWithoutGst = adults * spot.spotAdmission; // Only adults are charged
    const gstAmount = feeWithoutGst * gst;
    setPaymentAmount(feeWithoutGst + gstAmount); // Update the total fee
  };

  const validateBooking = () => {
    const newErrors = {};
    if (adults <= 0) newErrors.adults = "Please select at least one adult.";
    if (kids > 0 && adults === 0)
      newErrors.kids = "At least one adult is required for kids.";
    if (!bookingDate) {
      newErrors.bookingDate = "Please select a booking date.";
    } else {
      const bookingDateObj = new Date(bookingDate);
      const today = new Date();
      if (bookingDateObj < today) {
        newErrors.bookingDate = "Booking date must be in the future.";
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
        body: JSON.stringify({
          items: [{ id: spot.spotName, amount: paymentAmount * 100 }],
        }),
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
        {spot ? (
          <div className="max-w-lg mx-auto  p-6 rounded-lg bg-gray-200 bg-opacity-60">
            <h1 className="text-3xl font-bold mb-4"> Book {spot.spotName}</h1>
            <p>
              <strong>Location:</strong> {spot.spotLocation}
            </p>
            <p>
              <strong>Admission Fee:</strong> ${spot.spotAdmission}
            </p>
            <p>
              <strong>Spot Limit:</strong> {spot.spotLimit} persons
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
                  min="0"
                  className="border rounded p-2 m-2"
                />

                {adultError && (
                  <p className="p-2 error-message shadow-info-3">
                    {adultError}
                  </p>
                )}
              </p>
              <p>
                <label>Kids: (below 12)</label>
                <input
                  type="number"
                  value={kids}
                  onChange={(e) => {
                    setKids(Number(e.target.value));
                    calculateFee();
                  }}
                  min="0"
                  className="border rounded p-2 m-2"
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
          <div className="text-center text-3xl text-gray-500 py-20">
            Loading spot details...
          </div>
        )}
      </div>

      {showPaymentSection && clientSecret && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg transition-all transform translate-y-0">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              fee={paymentAmount}
              itemName={spot.spotName}
              spotId={spotId}
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
