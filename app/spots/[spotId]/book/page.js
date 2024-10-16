"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function BookingPage({}) {
  const { spotId } = useParams(); // Get dynamic route params
  const { isLoaded, isSignedIn, user } = useUser(); // Access loading and sign-in state
  const [spot, setSpot] = useState(null);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [bookingDate, setBookingDate] = useState("");
  const [totalFee, setTotalFee] = useState(0);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress:  "",
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
        console.error("Error fetching profile detaisl:", error)
      );
  }, [user, isLoaded, isSignedIn]);

  useEffect(() => {
    if (spot) {
      calculateFee();
    }
  }, [adults, kids]);

  const calculateFee = () => {
    if (!spot) {
      return; // Return early if spot is not yet loaded
    }
  
    const gst = 0.05;
    const totalPersons = adults + kids;
  
    if (totalPersons > spot.spotLimit) {
      setError("Number of persons exceeds the limit for this spot.");
      return;
    }
  
    const feeWithoutGst = adults * spot.spotAdmission; // Only adults are charged
    const gstAmount = feeWithoutGst * gst;
    const total = feeWithoutGst + gstAmount;
    setTotalFee(total); // Update the total fee
  }; 


  const handleConfirmBooking = () => {
    let hasError = false;

    // Validation
    if (adults <= 0) {
      setAdultError("Please select at least one adult.");
      hasError = true;
    } else {
      setAdultError("");
    }

    if (kids > 0 && adults === 0) {
      setKidError("At least one adult is required for kids.");
      hasError = true;
    } else {
      setKidError("");
    }

    if (new Date(bookingDate) < new Date()) {
      setDateError("Booking date cannot be earlier than today.");
      hasError = true;
    } else if (!bookingDate) {
      setDateError("Please select a booking date.");
      hasError = true;
    } else {
      setDateError("");
    }

    if (hasError) return;

    const bookingData = {
        spotId: spot.spotId,
        id: profileData.id,  // Corresponds to userId
        bookingDate: new Date(bookingDate),  // Make sure this is in a correct datetime format
        adults,
        kids,
        totalFee,
      };
      
      fetch("http://localhost:8000/spot-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Booking confirmed:", data);
          alert("Booking confirmed! A confirmation email has been sent.");
        })
        .catch((error) => console.error("Error confirming booking:", error));      
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-lg mx-auto bg-gray-200 bg-opacity-60 p-6 rounded-lg">
        {spot ? (
          <div>
            <h1 className="text-3xl font-bold mb-4">Book {spot.spotName}</h1>
            <p>
              <strong>Location:</strong> {spot.spotLocation}
            </p>
            <p>
              <strong>Admission Fee:</strong> ${spot.spotAdmission}
            </p>
            <p>
              <strong>Limit:</strong> {spot.spotLimit} persons
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
                  className="border rounded p-2"
                  min={0}
                  max={spot.spotLimit}
                />
                {adultError && <p className="text-red-500">{adultError}</p>}
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
                  className="border rounded p-2"
                  min={0}
                  max={spot.spotLimit}
                />
                {kidError && <p className="text-red-500">{kidError}</p>}
              </p>
              <p>
                <label>Booking Date:</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="border rounded p-2"
                  min={new Date()} // Prevents past dates from being selected
                />
                {dateError && <p className="text-red-500">{dateError}</p>}
              </p>

              <p>
                <strong>Total Fee (include 5% GST):</strong> $
                {totalFee.toFixed(2)}
              </p>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-6">  
              <button
                onClick={handleConfirmBooking}
                className="bg-yellow-500 text-white py-2 px-4 rounded ml-4"
              >
                Validation and Confirm Booking
              </button>
            </div>
          </div>
        ) : (
          <p>Loading spot details...</p>
        )}
      </div>
    </div>
  );
}
