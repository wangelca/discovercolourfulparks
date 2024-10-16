'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function UserBooking() {
    const [profileData, setProfileData] = useState(null); // Profile data is now an object
    const [bookings, setBookings] = useState([]); // Bookings is now an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for error handling
    const { user } = useUser(); // Get current user details from Clerk

    useEffect(() => {
        if (!user) return; // Ensure user is loaded and signed in
        
        async function fetchProfileAndBookings() {
            try {
                // Fetch user profile
                const profileResponse = await fetch(`http://localhost:8000/users/${user.id}`);
                if (!profileResponse.ok) {
                    throw new Error("Failed to fetch user profile data");
                }
                const profile = await profileResponse.json();
                setProfileData(profile);

                // Now fetch the bookings only when profile data is available
                const bookingsResponse = await fetch(`http://localhost:8000/users/${profile.id}/bookings`);
                if (!bookingsResponse.ok) {
                    throw new Error("Failed to fetch booking data");
                }
                const bookingsData = await bookingsResponse.json();
                setBookings(bookingsData); // Set the bookings array

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Could not load booking or profile details.");
            } finally {
                setLoading(false);
            }
        }

        // Trigger the combined fetching
        fetchProfileAndBookings();

    }, [user]); // Only run once when user is available

    // Display booking details
    return ( 
        <div className="max-w-lg mx-auto my-8">
            {/* The header is now always visible */}
            <h2 className="text-2xl font-bold mb-6">Booking History</h2>

            {loading ? (
                <p className="text-center text-lg">Loading booking details...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : bookings.length === 0 ? (
                <p>No booking found.</p>
            ) : (
                <div className="relative flex flex-col min-h-screen">
                    {bookings.map((booking) => (
                        <section key={booking.id} className="container mx-auto px-6 py-12 shadow-lg rounded-lg mb-4">
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
                    ))}
                </div>
            )}
        </div>
    );
}
