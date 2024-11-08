import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart } from "react-icons/fa";

export default function Events() {
  const [events, setEvents] = useState([]);
  const { isSignedIn, user } = useUser(); // Single useUser hook to avoid multiple updates
  const [profileData, setProfileData] = useState(null);

  // Fetch events data from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events: " + response.statusText);
        }
        const data = await response.json();

        // Fetch ratings for each event and attach it
        const eventsWithRatings = await Promise.all(
          data.map(async (event) => {
            try {
              const ratingResponse = await fetch(
                `http://localhost:8000/ratings/event/${event.eventId}`
              );
              if (ratingResponse.ok) {
                const ratingData = await ratingResponse.json();
                return { ...event, averageRating: ratingData.average_rating };
              } else {
                return { ...event, averageRating: null }; // Handle the case where rating is unavailable
              }
            } catch {
              return { ...event, averageRating: null };
            }
          })
        );

        setEvents(eventsWithRatings);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

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
        method: method,
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
          style={{ color: index < Math.round(rating) ? "#FFD700" : "#E0E0E0" }} // Yellow for filled stars, grey for empty
          className="text-2xl"
        >
          ★
        </span>
      ))}
    </div>
  );

  const currentDate = new Date();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Available Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.length > 0 ? (
          events.map((event) => {
            const isPastEvent = new Date(event.startDate) < currentDate;
            const isFavorite = profileData?.favEventId?.includes(event.eventId);

            return (
              <div
                key={event.eventId}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={event.eventImageUrl}
                    alt={event.eventName}
                    className="w-full h-48 object-cover p-2"
                  />
                  <FaHeart
                    onClick={() => handleToggleFavorite(event.eventId)}
                    className={`absolute top-4 right-4 text-3xl cursor-pointer drop-shadow-lg transition-colors z-10 ${
                      isFavorite ? "text-red-500" : "text-white"
                    } hover:text-red-600`}
                  />
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{event.eventName}</h2>
                  {event.averageRating ? (
                    <div className="flex items-center mb-2">
                      {renderStars(event.averageRating)}
                      <span className="ml-2 text-gray-700">
                        {event.averageRating.toFixed(1)} / 5
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-500 mb-2">No ratings yet</p>
                  )}
                  <p className="text-gray-700 mb-2">
                    {event.eventLocation || "Location not available"}
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {event.fee ? `$${event.fee}` : "Free"}
                  </p>
                  <p className="text-gray-600">
                    {format(new Date(event.startDate), "MMMM d, yyyy")}
                  </p>
                  <p className="text-gray-600">{event.startTime}</p>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <a
                    href={`/events/${event.eventId}`}
                    className="mt-4 inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-blue-600"
                  >
                    View Details
                  </a>
                  {isPastEvent ? (
                    <button className="mt-4 ml-3 inline-block bg-pink-400 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-pink-500">
                      Event Passed
                    </button>
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
                      className="mt-4 ml-3 inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-green-600"
                    >
                      Book Now
                    </button>
                  ) : (
                    <button className="mt-4 ml-3 inline-block bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-gray-600">
                      No booking is required.
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
