"use client"; // Mark this component as a Client Component

import { useState } from "react";
import Calendar from "../components/calendar";
import Events from "../components/eventlist";
import EventBookingPage from "./[eventId]/book/page"; // Import EventBookingPage

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false); // State to toggle between Events and Calendar
  const [showBooking, setShowBooking] = useState(false); // State to toggle booking form
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event for booking

  const handleEventBooking = (eventName) => {
    setSelectedEvent(eventName); // Set the selected event
    setShowBooking(true); // Show the booking form
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Toggle buttons */}
      <div className="flex justify-center my-4">
        <button
          className={`px-4 py-2 rounded-lg text-white mr-4 ${showCalendar ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
          onClick={() => { setShowCalendar(true); setShowBooking(false); }} // Show Calendar
        >
          Calendar View
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-white ${!showCalendar ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
          onClick={() => { setShowCalendar(false); setShowBooking(false); }} // Show Events
        >
          Events Card View
        </button>
      </div>

      {/* Conditionally render Calendar, Events, or Booking Form */}
      <div className="flex-grow">
        {showCalendar ? (
          <Calendar />
        ) : showBooking && selectedEvent ? (
          <EventBookingPage eventName={selectedEvent} /> // Pass the selected event name here
        ) : (
          <Events onEventSelect={handleEventBooking} /> // Pass the handler to the Events component
        )}
      </div>
    </div>
  );
}
