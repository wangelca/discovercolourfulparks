'use client';

import { useState } from "react";
import Calendar from "../components/calendar";
import Events from "../components/eventlist";

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false); // State to toggle between Events and Calendar

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Toggle buttons */}
      <div className="flex justify-center my-4">
        <button
          className={`px-4 py-2 rounded-lg text-white mr-4 ${showCalendar ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
          onClick={() => setShowCalendar(true)} // Show Calendar
        >
          Calendar View
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-white ${!showCalendar ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
          onClick={() => setShowCalendar(false)} // Show Events
        >
          Events Card View
        </button>
      </div>

      {/* Conditionally render Calendar or Events */}
      <div className="flex-grow">
        {showCalendar ? <Calendar /> : <Events />}
      </div>
    </div>
  );
}