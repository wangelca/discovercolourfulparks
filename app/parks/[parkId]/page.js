"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PlaceGallery from "../../components/googlePhoto";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";

function getReportTypeClass(reportType) {
  switch (reportType) {
    case "Fire Sightings":
      return "bg-red-500 text-white";
    case "Weather Alert":
      return "bg-amber-500 text-white";
    case "Driving Conditions":
      return "bg-gray-500 text-white";
    case "Terrain":
      return "bg-brown-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
}

export default function ParkPage() {
  const [park, setPark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedSpots, setRelatedSpots] = useState([]);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [parkReports, setParkReports] = useState([]);
  const [currentReportIndex, setCurrentReportIndex] = useState(0); // Tracks the starting index of displayed reports
  const reportsPerPage = 3; // Number of reports to show per "page"
  const { parkId } = useParams();
  const { user } = useUser();

  // Fetch park details, related spots, events, and reports
  useEffect(() => {
    async function fetchParkData() {
      try {
        const response = await fetch(`http://localhost:8000/parks/${parkId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch park data");
        }
        const parkData = await response.json();
        setPark(parkData);

        // Fetch related spots
        const spotsResponse = await fetch(
          `http://localhost:8000/parks/${parkId}/spots`
        );
        const spotsData = await spotsResponse.json();
        setRelatedSpots(spotsData);

        // Fetch related events
        const eventsResponse = await fetch(
          `http://localhost:8000/parks/${parkId}/events`
        );
        const eventsData = await eventsResponse.json();
        setRelatedEvents(eventsData);

        // Fetch park reports with corrected endpoint
        const reportsResponse = await fetch(
          `http://localhost:8000/reports/park/${parkId}`
        );
        if (!reportsResponse.ok) {
          console.warn(`Failed to fetch reports: ${reportsResponse.status}`);
          setParkReports([]);
        } else {
          const reportsData = await reportsResponse.json();
          setParkReports(
            reportsData.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            )
          ); // Sort by most recent
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching park data:", error);
        setLoading(false);
      }
    }
    fetchParkData();
  }, [parkId]);

  const handleNextReports = () => {
    setCurrentReportIndex((prevIndex) =>
      Math.min(prevIndex + reportsPerPage, parkReports.length)
    );
  };

  const handlePreviousReports = () => {
    setCurrentReportIndex((prevIndex) =>
      Math.max(prevIndex - reportsPerPage, 0)
    );
  };

  if (loading) {
    return <p className="loading-text">Loading park details...</p>;
  }

  return (
    <div className="relative flex flex-col min-h-screen p-6">
      {/* Park Reports Section */}
      <section className="container mx-auto px-6 py-6 bg-white bg-opacity-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Recent Park Reports
        </h2>
        <div className="space-y-4">
          {parkReports.length > 0 ? (
            parkReports
              .slice(currentReportIndex, currentReportIndex + reportsPerPage)
              .map((report) => (
                <div
                  key={report.reportID}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getReportTypeClass(
                          report.reportType
                        )}`}
                      >
                        {report.reportType}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-base">{report.details}</p>

                  {report.resolved && (
                    <div className="mt-2 p-2 bg-green-100 rounded-lg">
                      <span className="text-green-600 font-bold">Resolved</span>
                      {report.comment && (
                        <p className="text-gray-600 text-sm">
                          Comment: {report.comment}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p>No reports available for this park.</p>
          )}
        </div>

        <div className="flex justify-center mt-4 space-x-4">
          {currentReportIndex > 0 && (
            <button
              onClick={handlePreviousReports}
              className="text-black hover:underline focus:outline-none focus:ring-0"
            >
              Previous
            </button>
          )}
          {currentReportIndex + reportsPerPage < parkReports.length && (
            <button
              onClick={handleNextReports}
              className="text-black hover:underline focus:outline-none focus:ring-0"
            >
              Next
            </button>
          )}
        </div>
      </section>

      {/* Park Details Section */}
      <section className="container mx-auto px-6 py-6 bg-white bg-opacity-50">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{park.name}</h1>
        {/* Wrap content in a responsive container that stacks on small screens and aligns horizontally on medium+ screens */}
        <div className="flex flex-col md:flex-row md:items-start">
          <img
            src={park.parkImageUrl[0]}
            alt={park.name}
            className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow-lg"
          />
          {/* On small screens, the text and gallery stack below the image. On larger screens, they appear to the right. */}
          <div className="mt-4 md:mt-0 md:ml-6 w-full">
            <p className="text-lg text-gray-700 mb-4">{park.description}</p>
            <p className="text-gray-600 mb-2">
              Location: <strong>{park.location}</strong>
            </p>
            <PlaceGallery />
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="container mx-auto px-6 py-6 bg-white bg-opacity-50">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Location Map
        </h2>
        <div className="h-[400px] w-full rounded-lg shadow-lg">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${park.name}&zoom=10`}
            className="w-full h-full rounded-lg"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Related Spots Section */}
      <section className="container mx-auto px-6 py-6 bg-white bg-opacity-50">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Related Spots
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedSpots.length > 0 ? (
          relatedSpots.map((spot) => {            
            return (
              <div
                key={spot.spotId}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  {spot.spotImageUrl && (
                    <img
                      src={spot.spotImageUrl}
                      alt={`Image of ${spot.spotName}`}
                      className="w-full h-full object-cover p-1"
                    />
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">
                    {spot.spotName}
                  </h2>                  
                  {spot.spotAdmission > 0 ? (
                    <p className="text-gray-700">
                      <strong>Admission: $</strong> {spot.spotAdmission}
                    </p>
                  ) : (
                    <div>
                      {" "}
                      <strong>Free</strong>
                    </div>
                  )}
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {spot.spotDescription}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Location: </strong> {spot.spotLocation}
                  </p>
                  <a
                    href={`/spots/${spot.spotId}`}
                    className="w-full mt-auto inline-block text-gray-600 font-semibold py-1 px-4 rounded-lg transition hover:bg-amber-300 text-center"
                  >
                    View Details
                  </a>
                  
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-lg font-medium text-gray-500">
            No spots found.
          </div>
        )}
        </div>
      </section>

      {/* Related Events Section */}
      <section className="container mx-auto px-6 py-6 bg-white bg-opacity-50">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedEvents.length > 0 ? (
  relatedEvents
    .filter((event) => new Date(event.startDate) >= new Date()) // Only keep upcoming events
    .map((event) => {
      const isPastEvent = new Date(event.startDate) < new Date();

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
          </div>

          <div className="p-4 flex-grow flex flex-col">
            <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">
              {event.eventName}
            </h2>
            <p className="text-sm md:text-base text-gray-700 mb-2">
              {event.eventLocation || "Location not available"}
            </p>
            <p className="text-sm md:text-base text-gray-900 font-semibold">
              {event.fee ? `$${event.fee}` : "Free"}
            </p>
            <p className="text-sm md:text-base text-gray-600">
              {format(new Date(event.startDate), "MMMM d, yyyy h:mm a")}
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
            {event.requiredbooking ? (
              <button
                onClick={() => {
                  if (!isSignedIn) {
                    alert("Please sign in to continue booking.");
                    window.open("/sign-in", "_blank");
                  } else {
                    window.location.href = `/events/${event.eventId}/book`;
                  }
                }}
                className="w-full inline-block text-gray-600 font-semibold py-1 px-4 rounded-lg transition hover:bg-green-300 text-center"
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
  <p className="text-center col-span-full">
    No upcoming events found.
  </p>
)}

        </div>
      </section>
    </div>
  );
}
