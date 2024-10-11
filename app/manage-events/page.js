'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EventsAdmin() {
  const [events, setEvents] = useState([]); // Initialize with an empty array
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/events") 
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events Database</h1>
        <button
          onClick={() => router.push("/manage-events/add-event")}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-800 transition"
        >
          Add Event
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white opacity-80 border text-xs border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-left text-white font-semibold">
              <th className="w-1/10 py-3 px-3">Image</th>
              <th className="py-3 px-3">Event ID</th>
              <th className="py-3 px-3">Event Name</th>
              <th className="py-3 px-3">Park ID</th>
              <th className="py-3 px-3">Fee</th>
              <th className="py-3 px-3">Discount</th>
              <th className="w-1/5 py-3 px-3">Description</th>
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-3">Start Date</th>
              <th className="py-3 px-3">End Date</th>
              <th className="py-3 px-3">Parameters</th>
              <th className="py-3 px-3">Req. booking</th>
              <th className="py-3 px-3">Details</th>
              <th className="py-3 px-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr
                  key={event.eventId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="w-1/10 py-3 px-6">
                    {event.eventImageUrl && (
                      <img
                        src={event.eventImageUrl}
                        alt={`Image of ${event.eventName}`}
                        className="w-auto h-auto rounded-lg "
                      />
                    )}
                  </td>
                  <td className="py-3 px-3">{event.eventId}</td>
                  <td className="py-3 px-3">{event.eventName}</td>
                  <td className="py-3 px-3">{event.parkId}</td>
                  <td className="py-3 px-3">{event.fee}</td>
                  <td className="py-3 px-3">{event.discount}</td>
                  <td className="w-1/5 py-3 px-3">{event.description}</td>
                  <td className="py-3 px-3">{event.eventLocation}</td>
                  <td className="py-3 px-3">{event.startDate}</td>
                  <td className="py-3 px-3">{event.endDate}</td>
                  <td className="py-3 px-3">{event.parameters}</td>
                  <td className="py-3 px-3">{event.reqiredbooking}</td>
                  <td className="py-3 px-3">
                    <a
                      href={`/events/${event.eventId}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => router.push(`/edit-event/${event.eventId}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-3 text-gray-500">
                  No Events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

{
  /*ChatGPT Prompt
  please help to improve the CSS using tailwind css and next.js, i want the data to be presented as a list, and like a user-friendly database. Besides, at the top, please add an "Add button", i will use fast api to add the spots details. Then, at the right hand side of each spot, please add an "Edit" button or words, i will use fast api to update the spot details
   */
}
