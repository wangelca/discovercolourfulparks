"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ParkPage() {
  const [park, setPark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedSpots, setRelatedSpots] = useState([]);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const { parkId } = useParams();

  // Fetch park details, related spots, and events
  useEffect(() => {
    async function fetchParkData() {
      try {
        axios.get(`../api/park/${parkId}`).then((response) => {
          setPark(response.data);
        });

        // Fetch related spots
        const spotsResponse = await fetch(`/api/spot?parkId=${parkId}`);
        const spotsData = await spotsResponse.json();
        setRelatedSpots(spotsData);

        // Fetch related events
        const eventsResponse = await fetch(`/api/event?parkId=${parkId}`);
        const eventsData = await eventsResponse.json();
        setRelatedEvents(eventsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching park data:", error);
        setLoading(false);
      }
    }

    fetchParkData();
  }, [parkId]);

  if (loading) {
    return <p>Loading park details...</p>;
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Park Details Section */}
      <section className="container mx-auto px-6 py-12 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">{park.name}</h1>
        <div className="flex">
          <img
            src={park.parkImageUrl[0]}
            alt={park.name}
            className="w-1/2 h-auto object-cover rounded-lg shadow-lg"
          />
          <div className="ml-6">
            <p className="text-lg text-gray-700 mb-4">{park.description}</p>
            <p className="text-gray-600">
              Location: <strong>{park.location}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Location Map
        </h2>
        <div className="h-[400px] w-full rounded-lg shadow-lg">
          {/* Google Maps Integration */}
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
              park.parameters
            )}&zoom=10`}
            className="w-full h-full rounded-lg"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Related Spots Section */}
      <section className="container mx-auto px-6 py-12 bg-gray-50">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Related Spots
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedSpots.map((spot) => (
            <div
              key={spot.spotId}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              style={{ height: "400px" }}
            >
              <img
                src={spot.spotImageUrl[0]}
                alt={spot.spotName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {spot.spotName}
                </h3>
                <p className="text-gray-700 flex-grow overflow-hidden line-clamp-2">
                  {spot.spotDescription}
                </p>
                <a
                  href={`/spots/${spot.spotId}`}
                  className= "inline-flex items-center px-3 py-1.5 text-lg font-medium text-center text-black rounded-lg hover:bg-green-300  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Spot Details
                  <svg
                    class="rtl:rotate-180 w-4 h-4 ml-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Events Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedEvents.map((event) => (
            <div
              key={event.eventId}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
                            <img
                src={event.eventImageUrl[0]}

                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {event.eventName}
                </h3>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <p className="text-gray-600 mb-2">
                  Date: {new Date(event.startDate).toLocaleDateString()}
                </p>
                <a
                  href={`/events/${event.eventId}`}>
                <button type="button" class="text-yellow-500 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-bold rounded-lg px-5 py-2.5 text-center text-lg me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">View Event</button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
