"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaEdit,
  FaSearch,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedEvent, setEditedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "eventName",
    direction: "asc",
  });
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const eventsPerPage = 5;

  const formatEventDate = (dateInput) => {
    const date = new Date(dateInput);
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };

    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

    return `${formattedDate}, ${formattedTime}`;
  };

  const router = useRouter();

  useEffect(() => {
    const fetchTotalEventsCount = async () => {
      try {
        const response = await fetch("http://localhost:8000/events/count");
        if (!response.ok) {
          throw new Error(
            "Failed to fetch total events count: " + response.statusText
          );
        }
        const totalCount = await response.json();
        setTotalPages(Math.ceil(totalCount / eventsPerPage));
      } catch (error) {
        console.error("Error fetching total events count:", error);
      }
    };

    fetchTotalEventsCount();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/events?page=${currentPage}&limit=${eventsPerPage}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setEvents(data);
          setFilteredEvents(data);
        } else {
          const eventsWithRatings = await Promise.all(
            data.events.map(async (event) => {
              try {
                const ratingResponse = await fetch(
                  `http://localhost:8000/ratings/event/${event.eventId}`
                );
                if (ratingResponse.ok) {
                  const ratingData = await ratingResponse.json();
                  return { ...event, averageRating: ratingData.average_rating };
                }
                return { ...event, averageRating: null };
              } catch {
                return { ...event, averageRating: null };
              }
            })
          );

          setEvents(eventsWithRatings);
          setFilteredEvents(eventsWithRatings);
          setTotalPages(Math.ceil(data.total / eventsPerPage));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleInputChange = (e, field) => {
    setEditedEvent({ ...editedEvent, [field]: e.target.value });
  };

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

  const handleSave = (eventId) => {
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
        setEditingId(null);
      })
      .catch((error) => console.error("Error updating event:", error));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full">
          <div className="bg-gray-700 px-8 py-5">
            <div className="h-12 bg-gray-600 animate-pulse rounded w-3/4 mx-auto"></div>
          </div>
          <div className="p-8">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="mb-6 flex items-center">
                <div className="h-5 bg-gray-300 animate-pulse rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
        <div className="text-center w-full max-w-screen-lg">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h2 className="mt-6 text-3xl font-bold text-gray-600">
            No Events Found
          </h2>
          <p className="mt-3 text-gray-500">
            There are currently no events in the system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-10 max-w-[2300px]">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full">
        <div className="bg-gray-700 px-8 py-5 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Events Database</h1>
          <div className="flex items-center space-x-6">
            <span className="text-white font-bold text-lg">
              Total Events: {events.length}
            </span>
            <button
              onClick={() => router.push("/manage-events/add-event")}
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-b">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by event name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        <div className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  {[
                    { label: "Image", icon: FaCalendar },
                    { label: "Event ID", icon: FaTicketAlt },
                    { label: "Event Name", icon: FaCalendar },
                    { label: "Park ID", icon: FaMapMarkerAlt },
                    { label: "Fee", icon: FaTicketAlt },
                    { label: "Discount", icon: FaTicketAlt },
                    { label: "Description", icon: FaCalendar },
                    { label: "Location", icon: FaMapMarkerAlt },
                    { label: "Start Date", icon: FaCalendar },
                    { label: "End Date", icon: FaCalendar },
                    { label: "Req. Booking", icon: FaTicketAlt },
                    { label: "Details", icon: FaCalendar },
                    { label: "Edit", icon: FaEdit },
                  ].map(({ label, icon: Icon }, index) => (
                    <th
                      key={index}
                      className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="text-gray-500" />
                        <span>{label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr
                    key={event.eventId}
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                  >
                    <td className="py-4 px-6">
                      {event.eventImageUrl && (
                        <img
                          src={event.eventImageUrl}
                          alt={`Image of ${event.eventName}`}
                          className="w-auto h-auto rounded-lg"
                        />
                      )}
                    </td>
                    <td className="py-4 px-4">{event.eventId}</td>
                    <td className="py-4 px-4">
                      {editingId === event.eventId ? (
                        <input
                          type="text"
                          value={editedEvent?.eventName || event.eventName}
                          onChange={(e) => handleInputChange(e, "eventName")}
                          className="border p-2 rounded max-w-md"
                        />
                      ) : (
                        event.eventName
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {editingId === event.eventId ? (
                        <input
                          type="text"
                          value={editedEvent?.parkId || event.parkId}
                          onChange={(e) => handleInputChange(e, "parkId")}
                          className="border p-2 rounded max-w-md"
                        />
                      ) : (
                        event.parkId
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {editingId === event.eventId ? (
                        <input
                          type="text"
                          value={editedEvent?.fee || event.fee}
                          onChange={(e) => handleInputChange(e, "fee")}
                          className="border p-2 rounded max-w-md"
                        />
                      ) : (
                        event.fee
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {editingId === event.eventId ? (
                        <input
                          type="text"
                          value={editedEvent?.discount || event.discount}
                          onChange={(e) => handleInputChange(e, "discount")}
                          className="border p-2 rounded max-w-md"
                        />
                      ) : (
                        event.discount
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {editingId === event.eventId ? (
                        <textarea
                          value={editedEvent?.description || event.description}
                          onChange={(e) =>
                            handleInputChange(e, "description")
                          }
                          className="border p-2 rounded max-w-full"
                        />
                      ) : (
                        event.description
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {editingId === event.eventId ? (
                        <input
                          type="text"
                          value={
                            editedEvent?.eventLocation || event.eventLocation
                          }
                          onChange={(e) =>
                            handleInputChange(e, "eventLocation")
                          }
                          className="border p-2 rounded max-w-md"
                        />
                      ) : (
                        event.eventLocation
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {editingId === event.eventId ? (
                        <input
                          type="text"
                          value={editedEvent?.startDate || event.startDate}
                          onChange={(e) => handleInputChange(e, "startDate")}
                          className="border p-2 rounded max-w-md"
                        />
                      ) : (
                        formatEventDate(event.startDate)
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {editingId === event.eventId ? (
                        <input
                          type="text"
                          value={editedEvent?.endDate || event.endDate}
                          onChange={(e) => handleInputChange(e, "endDate")}
                          className="border p-2 rounded max-w-md"
                        />
                      ) : (
                        formatEventDate(event.endDate)
                      )}
                    </td>
                    <td className="py-4 px-4">{event.requiredbooking}</td>
                    <td className="py-4 px-4">
                      <a
                        href={`/events/${event.eventId}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    </td>
                    <td className="py-4 px-4">
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
                            setEditedEvent(event);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-6 flex justify-center items-center space-x-6">
        <button
  onClick={() => handlePageChange(currentPage - 1)}
  disabled={currentPage === 1}
  className="p-3 rounded-full bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
>
  <FaChevronLeft className="text-gray-600" />
</button>

<button
  onClick={() => handlePageChange(currentPage + 1)}
  disabled={currentPage === totalPages}
  className="p-3 rounded-full bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
>
  <FaChevronRight className="text-gray-600" />
</button>
        </div>
      </div>
    </div>
  );
}


{
  /*ChatGPT Prompt
  please help to improve the CSS using tailwind css and next.js, i want the data to be presented as a list, and like a user-friendly database. Besides, at the top, please add an "Add button", i will use fast api to add the spots details. Then, at the right hand side of each spot, please add an "Edit" button or words, i will use fast api to update the spot details
   */
}
