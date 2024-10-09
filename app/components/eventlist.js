"use client"; 

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation'; 
import { format } from 'date-fns'; 

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loadingEventId, setLoadingEventId] = useState(null);
  const router = useRouter(); 

  const id = 1;  // Replace with actual user ID dynamically (e.g., from Clerk authentication)
  const spotId = 1; // Static spot ID for now, or replace with actual spotId dynamically

  const eventImages = useMemo(() => ({
    "Indigenous Voices": "https://wereintherockies.com/wp-content/uploads/2024/08/CBGiftshop.jpeg",
    "Art In Nature Trail": "https://banfflakelouise.bynder.com/m/911bfa88a9147f0/2000x1080_jpg-2023_Banff_ArtinNatureTrail_signage_RobertMassey%20(0).jpg",
    "Fall Equinox Release & Reset Yoga Workshop": "https://www.risingfawngardens.com/wp-content/uploads/2022/07/mec-thumb-1026-362-IMG_0321-scaled.jpg",
    "Downtown Foodie Tour": "https://cdn.prod.website-files.com/65cd06b49d0a9fd5c7556909/661c2643b10c5b27b4fc9d03_Downtown-Foodie-Tour-700%20(Large).webp",
  }), []);

  useEffect(() => {
    fetch('http://localhost:8000/events')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const handleBooking = async (eventId, id, spotId, bookingStartTime, eventDate) => {
    if (!id || !spotId || !bookingStartTime) {
      alert('User ID, Spot ID, or booking start time is missing! Please make sure all required data is available.');
      return;
    }

    const date = new Date(eventDate);

    // Assuming bookingStartTime is in HH:MM AM/PM format:
    const [hours, minutesPeriod] = bookingStartTime.split(/[: ]/);
    const period = minutesPeriod.slice(-2);
    const minutes = parseInt(minutesPeriod.slice(0, 2));

    // Adjust hours for AM/PM
    date.setHours(period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : parseInt(hours));
    date.setMinutes(minutes || 0);

    // Ensure bookingStartTime is in ISO format (UTC time)
    const isoBookingStartTime = date.toISOString();

    setLoadingEventId(eventId);
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId, id, spotId, bookingStartTime: isoBookingStartTime }), 
      });
      const data = await response.json();

      if (data.success) {
        alert('Booking successful!');
        router.push('/confirmation');
      } else {
        alert('Booking failed.');
      }
    } catch (error) {
      console.error('Error booking event:', error);
      alert('There was an error processing your booking.');
    } finally {
      setLoadingEventId(null);
    }
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
                      onClick={() => handleBooking(event.eventId, id, spotId, event.startTime, event.startDate)}
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
