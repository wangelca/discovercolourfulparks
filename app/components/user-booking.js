"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { push } from "react-burger-menu";
import { useRouter } from "next/navigation";

export default function UserBooking() {
  const [profileData, setProfileData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [sortOrder, setSortOrder] = useState("date"); // For sorting
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    async function fetchProfileAndBookings() {
      try {
        const profileResponse = await fetch(
          `http://localhost:8000/users/${user.id}`
        );
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user profile data");
        }
        const profile = await profileResponse.json();
        setProfileData(profile);

        const bookingsResponse = await fetch(
          `http://localhost:8000/users/${profile.id}/bookings`
        );
        if (!bookingsResponse.ok) {
          throw new Error("Failed to fetch booking data");
        }
        const bookingsData = await bookingsResponse.json();
        const detailedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            if (booking.spotId) {
              const spotResponse = await fetch(
                `http://localhost:8000/spots/${booking.spotId}`
              );
              if (!spotResponse.ok) {
                throw new Error(
                  `Failed to fetch spot details for booking ${booking.id}`
                );
              }
              const spotDetails = await spotResponse.json();
              return { ...booking, type: "spot", details: spotDetails };
            } else if (booking.eventId) {
              const eventResponse = await fetch(
                `http://localhost:8000/events/${booking.eventId}`
              );
              if (!eventResponse.ok) {
                throw new Error(
                  `Failed to fetch event details for booking ${booking.id}`
                );
              }
              const eventDetails = await eventResponse.json();
              return { ...booking, type: "event", details: eventDetails };
            } else {
              return booking;
            }
          })
        );

        setBookings(detailedBookings);
      } catch (err) {
        setError("Could not load booking or profile details.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndBookings();
  }, [user]);

  // Filter bookings based on search query
  const filteredBookings = bookings.filter((booking) =>
    (booking.type === "spot"
      ? booking.details.spotName
      : booking.details.eventName
    )
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Sort bookings based on selected order
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(b.bookingDate) - new Date(a.bookingDate);
    } else if (sortOrder === "amount") {
      return b.paymentAmount - a.paymentAmount;
    }
    return 0;
  });

  return (
    <div className="container max-w-lg mx-auto my-8 max-h-screen">
      <h2 className="text-2xl font-bold mb-6">Booking History</h2>

      {loading ? (
        <p className="text-center text-lg">Loading booking details...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="flex-grow overflow-y-auto max-h-[80vh] scroll-smooth scroll-m-2">
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full h-12 rounded focus:outline-none px-3 focus:shadow-md"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fa fa-search absolute right-3 top-4 text-gray-300"></i>
          </div>

          <div className="mb-4">
            <label className="mr-2">Sort by:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="date">Booking Date</option>
              <option value="amount">Payment Amount</option>
            </select>
          </div>

          {sortedBookings.map((booking) => (
            <section
              key={booking.id}
              className="container mx-auto px-6 shadow-lg rounded-lg mb-4"
            >
              <div
                className="max-w-md mx-auto bg-white bg-opacity-60 shadow-lg rounded-lg overflow-hidden md:max-w-lg"
                //route the event or spot details page
                onClick={() =>
                  router.push(
                    booking.type === "spot"
                      ? `/spots/${booking.spotId}`
                      : `/events/${booking.eventId}`
                  )
                }
              >
                <div className="w-full p-4">
                  <ul>
                    <div className="mx-auto bg-green-500 bg-opacity-70">
                      {" "}
                      <span>ID: {booking.bookingId} </span>
                    </div>
                    <li
                      key={booking.id}
                      className="flex justify-between items-center bg-gray-500 bg-opacity-45 mt-2 p-2 hover:shadow-lg rounded cursor-pointer transition"
                    >
                      <div className="flex flex-col ml-2">
                        <span className="font-medium text-lg text-black">
                          {booking.type === "spot"
                            ? booking.details.spotName
                            : booking.details.eventName}
                        </span>
                        <span className="text-gray-900">
                          Event/ Booking Date: {booking.bookingDate}
                        </span>
                        <span className="text-sm text-black font-bold">
                          Paid: ${booking.paymentAmount}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-gray-900">
                          {booking.adults} Adults
                        </span>
                        <span className="text-gray-900">
                          {booking.kids} Kids
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
