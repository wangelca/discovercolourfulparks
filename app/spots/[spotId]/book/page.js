"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import { useUser  } from "@clerk/nextjs";

export default function BookingPage() {
    const { spotId } = useParams(); // Get dynamic route params
    const router = useRouter(); // Initialize useRouter
    const { isLoaded, isSignedIn, user } = useUser (); // Access loading and sign-in state
    const [spot, setSpot] = useState(null);
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
            .catch((error) => console.error("Error fetching profile details:", error));
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

        // Redirect to payment page with query parameters
        router.push(`/payment?spotId=${spot.spotId}&paymentAmount=${paymentAmount}&bookingDate=${bookingDate}&adults=${adults}&kids=${kids}`);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-lg mx-auto bg-gray-200 bg-opacity-60 p-6 rounded-lg">
                {spot ? (
                    <div>
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
                        <div className="mt-4">
                            <label>
                                Adults:
                                <input
                                    type="number"
                                    value={adults}
                                    onChange={(e) => setAdults(Number(e.target.value))}
                                    min="0"
                                    className="ml-2 border rounded p-1"
                                />
                            </label>
                            {adultError && <p className="text-red-500">{adultError}</p>}
                        </div>
                        <div className="mt-4">
                            <label>
                                Kids:
                                <input
                                    type="number"
                                    value={kids}
                                    onChange={(e) => setKids(Number(e.target.value))}
                                    min="0"
                                    className="ml-2 border rounded p-1"
                                />
                            </label>
                            {kidError && <p className="text-red-500">{kidError}</p>}
                        </div>
                        <div className="mt-4">
                            <label>
                                Booking Date:
                                <input
                                    type="date"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    className="ml-2 border rounded p-1"
                                />
                            </label>
                            {dateError && <p className="text-red-500">{dateError}</p>}
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={handleConfirmBooking}
                                className="bg-amber-500 text-white rounded p-2"
                            >
                                Confirm Booking
                            </button>
                        </div>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </div>
                ) : (
                    <p>Loading spot details...</p>
                )}
            </div>
        </div>
    );
}
