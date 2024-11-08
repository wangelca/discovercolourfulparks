"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function EventBookingPage({}) {
  const { eventId } = useParams(); // Get dynamic route params
  const { isLoaded, isSignedIn, user } = useUser(); // Access loading and sign-in state
  const [event, setEvent] = useState(null);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [bookingDate, setBookingDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
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

  const formatEventDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Format the date and time separately
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  
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
    if (event) {
      calculateFee();
    }
  }, [adults, kids]);

  const calculateFee = () => {
    if (!event) {
      return;
    }

    const gst = 0.05;
    const feeWithoutGst = adults * event.fee; // Only adults are charged
    const gstAmount = feeWithoutGst * gst;
    const total = feeWithoutGst + gstAmount;
    setPaymentAmount(total); // Update the total fee
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

    if (!bookingDate) {
      setDateError("Please select a booking date.");
      hasError = true;
    } else {
      // Convert the booking date string to a Date object
      const bookingDateObj = new Date(bookingDate);
  
      // Convert event startDate and endDate to Date objects
      const eventStartDate = new Date(event.startDate.split('T')[0]); // Extract date without time
      const eventEndDate = new Date(event.endDate.split('T')[0]); // Extract date without time
  
      // Compare dates (ignoring time)
      if (bookingDateObj < eventStartDate || bookingDateObj > eventEndDate) {
        setDateError("Booking date must be within the event date range.");
        hasError = true;
      } else if (bookingDateObj < new Date().setHours(0, 0, 0, 0)) {
        setDateError("Booking date cannot be in the past.");
        hasError = true;
      } else {
        setDateError("");
      }
    }

    if (hasError) return;

    const bookingData = {
      eventId: event.eventId,
      id: profileData.id, // Corresponds to userId
      bookingDate: new Date(bookingDate), // Make sure this is in a correct datetime format
      adults,
      kids,
      paymentAmount,
    };

    fetch("http://localhost:8000/event-bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Booking confirmed! A confirmation email will be sent.");
        push("/events");
      })
      .catch((error) => console.error("Error confirming booking:", error));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-lg mx-auto bg-gray-200 bg-opacity-60 p-6 rounded-lg">
        {event ? (
          <div>
            <h1 className="text-3xl font-bold mb-4">Book {event.eventName}</h1>
            <p>
              <strong>Location:</strong> {event.eventLocation}
            </p>
            <p>
              <strong>Admission Fee:</strong> ${event.fee}
            </p>
            <p>
              <strong>Event Date:</strong> {formatEventDate(event.startDate, event.endDate)}
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
                {adultError && <p className="p-2 error-message shadow-info-3">{adultError}</p>}
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
                  className="border rounded p-2 m-2 align-right"
                  min={0}
                />
                {kidError && <p className="p-2 error-message shadow-info-3">{kidError}</p>}
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
                {dateError && <p className="p-2 error-message shadow-info-3">{dateError}</p>}
              </p>

              <p>
                <strong>Total Fee (include 5% GST):</strong> $
                {paymentAmount.toFixed(2)}
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={handleConfirmBooking}
                className="bg-green-500 text-white py-2 px-4 rounded self-center"
              >
                Validation and Confirm Booking
              </button>
            </div>
          </div>
        ) : (
          <p>Loading event details...</p>
        )}
      </div>
    </div>
  );
}
