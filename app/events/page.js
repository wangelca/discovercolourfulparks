"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic Imports to improve loading performance
const Calendar = dynamic(() => import("../components/calendar"));
const Events = dynamic(() => import("../components/eventlist"));
const EventBookingPage = dynamic(() => import("./[eventId]/book/page"));


export default function Home() {
  // Using a single state variable for simplicity
  const [viewMode, setViewMode] = useState("events"); // Possible values: 'events', 'calendar', 'booking'
  const [selectedEvent, setSelectedEvent] = useState(null); // Stores the selected event for booking

  // Event booking handler
  const handleEventBooking = (eventName) => {
    setSelectedEvent(eventName);
    setViewMode("booking");
  };

  // Handler to show calendar view
  const showCalendarView = () => {
    setViewMode("calendar");
  };

  // Handler to show events view
  const showEventsView = () => {
    setViewMode("events");
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Toggle buttons */}
      <div className="flex justify-center my-4">
        <button
          className={`px-4 py-2 rounded-lg text-white mr-4 ${
            viewMode === "calendar"
              ? "bg-blue-700"
              : "bg-amber-500 hover:bg-amber-600"
          }`}
          onClick={showCalendarView}
        >
          Calendar View
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-white ${
            viewMode === "events"
              ? "bg-blue-700"
              : "bg-amber-500 hover:bg-amber-600"
          }`}
          onClick={showEventsView}
        >
          Events Card View
        </button>
      </div>

      {/* Main content - use Suspense to handle loading state */}
      <div className="flex-grow">
        <Suspense fallback={<div>Loading...</div>}>
          {viewMode === "calendar" && <Calendar />}
          {viewMode === "booking" && selectedEvent && (
            <EventBookingPage eventName={selectedEvent} />
          )}
          {viewMode === "events" && (
            <Events onEventSelect={handleEventBooking} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
