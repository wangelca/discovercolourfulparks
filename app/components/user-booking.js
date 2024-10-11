'use client;'

import { useEffect, useState } from "react";
import { useUser} from "@clerk/nextjs";
import { useParams } from "next/navigation";

export default function UserBooking() {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for error handling
    const { userId } = useParams();
    
    // Fetch booking details
    useEffect(() => {
        async function fetchBookingData() {
        try {
            const response = await fetch(`http://localhost:8000/users/${userId}/bookings`);
            if (!response.ok) {
            throw new Error("Failed to fetch booking data");
            }
            const bookingData = await response.json();
            setBooking(bookingData);
        } catch (error) {
            console.error("Error fetching booking data:", error);
            setError("Could not load booking details.");
        } finally {
            setLoading(false);
        }
        }
        fetchBookingData();
    }, [userId]);
    
    // Display booking details
    return ( <div className="max-w-lg mx-auto my-8">
        {/* The header is now always visible */}
        <h2 className="text-2xl font-bold mb-6">Booking History</h2>

        {loading ? (
            <p className="text-center text-lg">Loading booking details...</p>
        ) : error ? (
            <p className="text-center text-red-500">{error}</p>
        ) : !booking || Object.keys(booking).length === 0 ? (
            <p>No booking found.</p>
        ) : (
            <div className="relative flex flex-col min-h-screen">
                {/* Booking Details Section */}
                <section className="container mx-auto px-6 py-12 shadow-lg rounded-lg">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">{booking.name}</h1>
                    <div className="flex">
                        <div className="ml-6">
                            <p className="text-lg text-gray-700 mb-4">{booking.description}</p>
                            <p className="text-lg text-gray-700 mb-4">Date: {booking.date}</p>
                            <p className="text-lg text-gray-700 mb-4">Time: {booking.time}</p>
                            <p className="text-lg text-gray-700 mb-4">Location: {booking.location}</p>
                        </div>
                    </div>
                </section>
            </div>
        )}
    </div>
    );
}