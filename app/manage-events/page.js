"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EventsAdmin() {
  const [events, setEvents] = useState([]); // Initialize with an empty array
  const [editingId, setEditingId] = useState(null); // Track which event is being edited
  const [editedEvent, setEditedEvent] = useState(null); // Store edited event data
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [sortConfig, setSortConfig] = useState({
    key: "eventName",
    direction: "asc",
  }); // Sorting state
  const [filteredEvents, setFilteredEvents] = useState([]); // For search results
  
  const formatEventDate = (dateInput) => {
    const date = new Date(dateInput);
  
    // Format the date and time separately
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  
    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions)
  
    // Return formatted date and time
    return `${formattedDate}, ${formattedTime}`;
  };

  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  // Handle changing event data during edit
  const handleInputChange = (e, field) => {
    setEditedEvent({ ...editedEvent, [field]: e.target.value });
  };

  // Filter events based on search term
  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedEvents = [...filteredEvents].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredEvents(sortedEvents);
  };

  // Handle save action
  const handleSave = (eventId) => {
    // Update the event using FastAPI
    fetch(`http://localhost:8000/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedEvent),
    })
      .then((response) => response.json())
      .then(() => {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.eventId === eventId ? { ...event, ...editedEvent } : event
          )
        );
        setEditingId(null); // Exit editing mode
      })
      .catch((error) => console.error("Error updating event:", error));
  };

  return (
    <div className="container mx-auto p-6 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events Database</h1>
        <button
          onClick={() => router.push("/manage-events/add-event")}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-800 transition"
        >
          Add Event
        </button>
      </div>

            {/* Search Bar */}
            <div className="mb-4">
        <input
          type="text"
          placeholder="Search by event name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-full rounded"
          max-width="50%"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white opacity-85 border text-black text-sm font-medium border-gray-200 rounded-lg table-fixed">
          <thead>
            <tr className="bg-gray-700 text-left text-white font-semibold">
              <th className="w-1/10 py-3 px-3">Image</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('eventId')}>Event ID</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('eventName')}>Event Name</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('parkId')}>Park ID</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('fee')}>Fee</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('discount')}>Discount</th>
              <th className="w-1/5 py-3 px-3">Description</th>
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('startDate')}>Start Date</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('endDate')}>End Date</th>
              <th className="w-6 py-3 px-3">Parameters</th>
              <th className="py-3 px-3">Req. booking</th>
              <th className="py-3 px-3">Details</th>
              <th className="py-3 px-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
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
                  <td className="py-3 px-3">
                    {editingId === event.eventId ? (
                      <input
                        type="text"
                        value={editedEvent?.eventName || event.eventName}
                        onChange={(e) => handleInputChange(e, "eventName")}
                        className="border p-1 rounded max-w-xs"
                      />
                    ) : (
                      event.eventName
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {editingId === event.eventId ? (
                      <input
                        type="text"
                        value={editedEvent?.parkId || event.parkId}
                        onChange={(e) => handleInputChange(e, "parkId")}
                        className="border p-1 rounded max-w-5"
                      />
                    ) : (
                      event.parkId
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {editingId === event.eventId ? (
                      <input
                        type="text"
                        value={editedEvent?.fee || event.fee}
                        onChange={(e) => handleInputChange(e, "fee")}
                        className="border p-1 rounded max-w-5"
                      />
                    ) : (
                      event.fee
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {editingId === event.eventId ? (
                      <input
                        type="text"
                        value={editedEvent?.discount || event.discount}
                        onChange={(e) => handleInputChange(e, "discount")}
                        className="border p-1 rounded max-w-5"
                      />
                    ) : (
                      event.discount
                    )}
                  </td>
                  <td className="w-1/5 py-3 px-3">
                    {editingId === event.eventId ? (
                      <textarea
                        value={editedEvent?.description || event.description}
                        onChange={(e) => handleInputChange(e, "description")}
                        className="border p-1 rounded"
                      />
                    ) : (
                      event.description
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {editingId === event.eventId ? (
                      <input
                        type="text"
                        value={
                          editedEvent?.eventLocation || event.eventLocation
                        }
                        onChange={(e) => handleInputChange(e, "eventLocation")}
                        className="border p-1 rounded"
                      />
                    ) : (
                      event.eventLocation
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {editingId === event.eventId ? (
                      <input
                        type="text"
                        value={editedEvent?.startDate || event.startDate}
                        onChange={(e) => handleInputChange(e, "startDate")}
                        className="border p-1 rounded"
                      />
                    ) : (
                      formatEventDate(event.startDate)
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {editingId === event.eventId ? (
                      <input
                        type="text"
                        value={editedEvent?.endDate || event.endDate}
                        onChange={(e) => handleInputChange(e, "endDate")}
                        className="border p-1 rounded"
                      />
                    ) : (
                      formatEventDate(event.endDate)
                    )}
                  </td>
                  <td className=" max-w-6 py-3 px-3 break-all ">
                    {event.parameters}{" "}
                  </td>
                  <td className="py-3 px-3">{event.requiredbooking}</td>
                  <td className="py-3 px-3">
                    <a
                      href={`/events/${event.eventId}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="py-3 px-6">
                    {editingId === event.eventId ? (
                      <button
                        onClick={() => handleSave(event.eventId)}
                        className="text-green-600 hover:underline"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(event.eventId);
                          setEditedEvent(event); // Start editing the current event
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    )}
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
