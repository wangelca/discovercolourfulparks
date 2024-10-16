"use client"; // Mark this component as a Client Component

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation'; 
import { format } from 'date-fns'; 
import { useBooking } from '../context/BookingContext'; // Import the context

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loadingEventId, setLoadingEventId] = useState(null);
    const router = useRouter(); // Initialize useRouter
    const { setBookingDetails } = useBooking(); // Get the setBookingDetails function from context
    const id = 1;  // Replace with actual user ID dynamically

    // Image URLs for events
    const eventImages = useMemo(() => ({
        "Indigenous Voices": "https://wereintherockies.com/wp-content/uploads/2024/08/CBGiftshop.jpeg",
        "Art In Nature Trail": "https://banfflakelouise.bynder.com/m/911bfa88a9147f0/2000x1080_jpg-2023_Banff_ArtinNatureTrail_signage_RobertMassey%20(0).jpg",
        "Fall Equinox Release & Reset Yoga Workshop": "https://www.risingfawngardens.com/wp-content/uploads/2022/07/mec-thumb-1026-362-IMG_0321-scaled.jpg",
        "Downtown Foodie Tour": "https://cdn.prod.website-files.com/65cd06b49d0a9fd5c7556909/661c2643b10c5b27b4fc9d03_Downtown-Foodie-Tour-700%20(Large).webp",
        "Downtown Foodie Tour (Fall 2024)": "https://cdn.prod.website-files.com/65cd06b49d0a9fd5c7556909/661c2643b10c5b27b4fc9d03_Downtown-Foodie-Tour-700%20(Large).webp",
        "Banff National Park Winter Wonderland Festival": "https://banfflakelouise.bynder.com/m/db74a3ff41e471/2000x1080_jpg-2016_BanffUpperHotSprings_Wellness_NoelHendrickson%20(1).jpg"
    }), []);

    // Fetch events data from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:8000/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events: ' + response.statusText);
                }
                const data = await response.json();
                console.log("Fetched events data:", data); // Debugging log
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
                alert('Failed to fetch events. Please try again later.');
            }
        };

        fetchEvents();
    }, []);

    const handleBooking = (eventId, startDate, eventName) => {
        // Check if user ID and start date are available
        if (!id || !startDate) {
            alert('User ID or booking start time is missing!');
            return;
        }

        setLoadingEventId(eventId);

        const bookingData = {
            eventId,
            userId: id,  
            bookingStartTime: startDate,
        };

        setBookingDetails(bookingData); // Store booking details in context

        // Construct the URL with query parameters manually
        const url = `/booking/event?eventName=${encodeURIComponent(eventName)}&eventId=${eventId}`;

        // Debugging logs
        console.log('Pushing to router:', { eventName, eventId });

        // Navigate to the booking event page
        router.push(url);
    };

    const currentDate = new Date();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Available Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.length > 0 ? (
                    events.map((event) => {
                        const isPastEvent = new Date(event.startDate) < currentDate;

                        return (
                            <div key={event.eventId} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img
                                    src={eventImages[event.eventName] || "https://via.placeholder.com/400x200"}
                                    alt={event.eventName}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-2">{event.eventName}</h2>
                                    <p className="text-gray-700 mb-2">{event.eventLocation || 'Location not available'}</p>
                                    <p className="text-gray-900 font-semibold">
                                        {event.fee ? `$${event.fee}` : 'Free'}
                                    </p>
                                    <p className="text-gray-600">{format(new Date(event.startDate), 'MMMM d, yyyy')}</p>
                                    <p className="text-gray-600">{event.startTime}</p>
                                    <p className="text-gray-600 mb-4">{event.description}</p>

                                    {isPastEvent ? (
                                        <p className="text-red-500 font-semibold">Event has passed. Booking unavailable.</p>
                                    ) : (
                                        <button
                                            onClick={() => handleBooking(event.eventId, event.startDate, event.eventName)}
                                            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${loadingEventId === event.eventId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={loadingEventId === event.eventId}
                                        >
                                            {loadingEventId === event.eventId ? 'Booking...' : 'Book Now'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center col-span-3">No events found.</p>
                )}
            </div>
        </div>
    );
}
