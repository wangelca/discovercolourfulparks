'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ReviewsComponent from '@/app/components/reviews';

export default function EventDetails() {
  const { eventId } = useParams(); // Get dynamic route params
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
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
    async function fetchEventData() {
      try {
        const response = await fetch(`http://localhost:8000/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }
        const eventData = await response.json();
        setEvent(eventData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    }
    fetchEventData();
  }, [eventId]);

  if (!event || loading) {
    return <div className="text-center text-3xl text-gray-500 py-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto bg-gray-200 bg-opacity-60 p-6 rounded-lg">
        
        {/* Event Image */}
        {event.eventImageUrl && (
          <img
            src={event.eventImageUrl[0]}  // Use the first image in the array
            alt={`Image of ${event.eventName}`}
            className="w-full h-80 object-cover filter brightness-90"
          />
        )}
        
        {/* Event Content */}
        <div className="p-8 text-gray-700 bg-opacity-80 backdrop-blur-lg bg-white rounded-b-lg">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.eventName}</h1>

            <div>
              <p className="text-lg mb-2">
                <span className="font-semibold text-gray-800">Location:</span> {event.eventLocation}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold text-gray-800">Description:</span> {event.description}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold text-gray-800">Fee:</span> ${event.fee}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold text-gray-800">Discount:</span>  ${event.discount}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold">Event Date:</span>  {formatEventDate(event.startDate, event.endDate)}
              </p>
            </div>

          <ReviewsComponent itemType ="event" itemId={eventId} />

        </div>
      </div>
    </div>
  );
}
