"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

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


  return (
    <div className="relative flex flex-col min-h-screen">
      

      {/* Main content - use Suspense to handle loading state */}
      <div className="flex-grow">
        <Suspense fallback={<div className="loading-text">Loading...</div>}>
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
