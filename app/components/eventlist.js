"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart } from "react-icons/fa";

export default function Events() {
  const [events, setEvents] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 9;
  const { isSignedIn, user } = useUser();
  const [profileData, setProfileData] = useState(null);

  // Fetch total count of events
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

  // Fetch events data from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/events?page=${currentPage}&limit=${eventsPerPage}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setEvents(data);
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
          setTotalPages(Math.ceil(data.total / eventsPerPage));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [currentPage]);
  // Fetch profile data if the user is signed in
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const profileResponse = await fetch(
          `http://localhost:8000/users/${user.id}`
        );
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user profile data");
        }
        const profile = await profileResponse.json();
        setProfileData(profile);
      } catch (err) {
        console.error("Failed to fetch user profile data.", err);
      }
    };

    fetchProfile();
  }, [user]);

  const handleToggleFavorite = async (eventId) => {
    if (!isSignedIn) {
      alert("Please sign in to add or remove this event from your favorites.");
      window.open("/sign-in", "_blank");
      return;
    }

    try {
      const isFavorite = profileData?.favEventId?.includes(eventId);
      const method = isFavorite ? "DELETE" : "PUT";
      const url = isFavorite
        ? `http://localhost:8000/user/${profileData.id}/favorites?event_id=${eventId}`
        : `http://localhost:8000/user/${profileData.id}/favorites`;

      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (method === "PUT") {
        options.body = JSON.stringify({ event_id: eventId });
      }

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      setProfileData((prevProfile) => {
        const updatedFavorites = isFavorite
          ? prevProfile.favEventId.filter((id) => id !== eventId)
          : [...(prevProfile.favEventId || []), eventId];
        return { ...prevProfile, favEventId: updatedFavorites };
      });

      toast.success(
        isFavorite
          ? "Event removed from your favorites!"
          : "Event added to your favorites!",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeButton: true,
        }
      );
    } catch (error) {
      toast.error("Failed to update favorites. Please try again later.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeButton: true,
      });
    }
  };

  const renderStars = (rating) => (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          style={{ color: index < Math.round(rating) ? "#FFD700" : "#E0E0E0" }}
          className="text-xl md:text-2xl"
        >
          ★
        </span>
      ))}
    </div>
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const currentDate = new Date();

  return (
    <div className="container mx-auto p-6 flex flex-col items-center w-11/12 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {events.length > 0 ? (
          events.map((event) => {
            const isPastEvent = new Date(event.startDate) < currentDate;
            const isFavorite = profileData?.favEventId?.includes(event.eventId);

            return (
              <div
                key={event.eventId}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.eventImageUrl?.[0] || "/path/to/default.jpg"}
                    alt={event.eventName}
                    className="w-full h-full object-cover p-1"
                  />
                  <FaHeart
                    onClick={() => handleToggleFavorite(event.eventId)}
                    className={`absolute top-4 right-4 text-2xl md:text-3xl cursor-pointer drop-shadow-lg transition-colors z-10 ${
                      isFavorite ? "text-red-500" : "text-white"
                    } hover:text-red-600`}
                  />
                </div>

                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">
                    {event.eventName}
                  </h2>
                  {event.averageRating ? (
                    <div className="flex items-center mb-2">
                      {renderStars(event.averageRating)}
                      <span className="ml-2 text-sm md:text-base text-gray-700">
                        {event.averageRating.toFixed(1)} / 5
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-500 mb-2">No ratings yet</p>
                  )}
                  <p className="text-sm md:text-base text-gray-700 mb-2">
                    {event.eventLocation || "Location not available"}
                  </p>
                  <p className="text-sm md:text-base text-gray-900 font-semibold">
                    {event.fee ? `$${event.fee}` : "Free"}
                  </p>
                  <p className="text-sm md:text-base text-gray-600">
                    {format(new Date(event.startDate), "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm md:text-base text-gray-600">
                    {event.startTime}
                  </p>
                  <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <a
                    href={`/events/${event.eventId}`}
                    className="w-full mt-auto inline-block text-gray-600 font-semibold py-1 px-4 rounded-lg transition hover:bg-amber-300 text-center"
                  >
                    View Details
                  </a>
                  {isPastEvent ? (
                    <span className="w-full  text-gray-600 font-semibold py-1 px-4 rounded-lg transition hover:bg-gray-200 text-center">
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
                      className="w-full  inline-block  text-gray-600 font-semibold py-1 px-4 rounded-lg transition hover:bg-green-300 text-center"
                    >
                      Book Now
                    </button>
                  ) : (
                    <span className="w-full inline-block text-gray-600 font-semibold py-1 px-4 rounded-lg transition hover:bg-gray-200 text-center">
                      No Booking Required
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-full">No events found.</p>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        {/* First Page Button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          First
        </button>

        {/* Previous Page Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        {/* Page Number Display */}
        <span className="px-4 py-2 mx-2 text-sm md:text-lg text-white">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Page Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          Last
        </button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
