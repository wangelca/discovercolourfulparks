"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ReviewsComponent from "@/app/components/reviews";
import { useUser } from "@clerk/nextjs";

export default function EventDetails() {
  const { eventId } = useParams(); // Get dynamic route params
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPastEvent, setIsPastEvent] = useState(false);
  const { isSignedIn } = useUser();
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
    async function fetchEventData() {
      try {
        const response = await fetch(`http://localhost:8000/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }
        const eventData = await response.json();
        setEvent(eventData);
        setLoading(false);
        if (new Date(eventData.startDate) < new Date()) {
          setIsPastEvent(true);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    }
    fetchEventData();
  }, [eventId]);

  if (!event || loading) {
    return (
      <div className="text-center text-3xl text-gray-500 py-20">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-gray-200 bg-opacity-60 p-1 sm:p-1 rounded-lg">
        {/* Event Image */}
        {event.eventImageUrl && (
          <img
            src={event.eventImageUrl[0]} // Use the first image in the array
            alt={`Image of ${event.eventName}`}
            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg filter brightness-90"
          />
        )}

        {/* Event Content */}
        <div className="p-6 sm:p-8 text-gray-700 bg-opacity-80 backdrop-blur-lg bg-white rounded-b-lg">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            {event.eventName}
          </h1>

          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold text-gray-800">Location:</span>{" "}
              {event.eventLocation}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-800">Description:</span>{" "}
              {event.description}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-800">Fee:</span> ${" "}
              {event.fee}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-800">Discount:</span> ${" "}
              {event.discount}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Event Date:</span>{" "}
              {formatEventDate(event.startDate, event.endDate)}
            </p>
          </div>

          <div className="mt-6">
            {isPastEvent ? (
              <span className="w-full inline-block text-gray-600 font-semibold py-2 px-4 rounded-lg transition hover:bg-gray-200 text-center">
                Event Passed
              </span>
            ) : event.requiredbooking ? (
              <button
                onClick={() => {
                  if (!isSignedIn) {
                    alert("Please sign in to continue booking.");
                    window.open("/sign-in", "_blank");
                  } else {
                    window.location.href = `/events/${event.eventId}/book`;
                  }
                }}
                className="w-full inline-block  text-gray-600 font-semibold py-1 px-4 rounded-lg transition hover:bg-green-300 text-center"
              >
                Book Now
              </button>
            ) : (
              <span className="w-full inline-block text-gray-600 font-semibold py-2 px-4 rounded-lg transition hover:bg-gray-200 text-center">
                No Booking Required
              </span>
            )}
          </div>

          <ReviewsComponent itemType="event" itemId={eventId} />
        </div>
      </div>
    </div>
  );
}
