"use client"; // Mark this component as a Client Component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useBooking } from "../context/BookingContext"; // Import the context
import { useUser } from "@clerk/nextjs"; // Import the Clerk hook

export default function Events() {
  const [events, setEvents] = useState([]);
  const router = useRouter(); // Initialize useRouter
  const { isSignedIn } = useUser(); // Check if the user is signed in

  // Fetch events data from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events: " + response.statusText);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        alert("Failed to fetch events. Please try again later.");
      }
    };

    fetchEvents();
  }, []);

  const currentDate = new Date();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Available Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.length > 0 ? (
          events.map((event) => {
            const isPastEvent = new Date(event.startDate) < currentDate;

            return (
              <div
                key={event.eventId}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={event.eventImageUrl}
                  alt={event.eventName}
                  className="w-full h-48 object-cover p-2"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{event.eventName}</h2>
                  <p className="text-gray-700 mb-2">
                    {event.eventLocation || "Location not available"}
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {event.fee ? `$${event.fee}` : "Free"}
                  </p>
                  <p className="text-gray-600">
                    {format(new Date(event.startDate), "MMMM d, yyyy")}
                  </p>
                  <p className="text-gray-600">{event.startTime}</p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <a
                  href={`/events/${event.eventId}`}
                  className="mt-4 inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-blue-600"
                >
                  View Details
                </a>
                  {isPastEvent ? (
                    <p className="text-red-500 font-semibold">
                      Event has passed. Booking unavailable.
                    </p>
                  ) : event.requiredbooking ? (
                    <button
                      onClick={() => {
                        if (!isSignedIn) {
                          alert("Please sign in to continue booking.");
                          window.open("/sign-in", "_blank"); // Open Clerk sign-in in a new tab
                        } else {
                          window.location.href = `/events/${event.eventId}/book`; // Direct to booking page
                        }
                      }}
                      className="mt-4 ml-3 inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-green-600"
                    >
                      Book Now
                    </button>
                  ) : (
                    <div>No booking is required.</div>
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
