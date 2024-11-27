"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ReviewsComponent from "@/app/components/reviews";
import { useUser } from "@clerk/nextjs";

export default function SpotDetails() {
  const { spotId } = useParams(); // Get dynamic route params
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();

  useEffect(() => {
    async function fetchSpotData() {
      try {
        const response = await fetch(`http://localhost:8000/spots/${spotId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch spot data");
        }
        const spotData = await response.json();
        setSpot(spotData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching spot data:", error);
      }
    }
    fetchSpotData();
  }, [spotId]);

  if (!spot || loading) {
    return (
      <div className="text-center text-3xl text-gray-500 py-20">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-gray-200 bg-opacity-60 p-1 sm:p-1 rounded-lg">
        {/* Spot Image */}
        {spot.spotImageUrl && (
          <img
            src={spot.spotImageUrl}
            alt={`Image of ${spot.spotName}`}
            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg filter brightness-90"
          />
        )}

        {/* Spot Content */}
        <div className="p-6 sm:p-8 text-gray-700 bg-opacity-80 backdrop-blur-lg bg-white rounded-b-lg">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            {spot.spotName}
          </h1>

          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold text-gray-800">Location:</span>{" "}
              {spot.spotLocation}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-800">Description:</span>{" "}
              {spot.spotDescription}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-800">Fee:</span> ${" "}
              {spot.spotAdmission}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-800">Discount:</span> ${" "}
              {spot.spotDiscount}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-800">Business Hour:</span>{" "}
              {spot.openingHour} - {spot.closingHour}
            </p>            
          </div>

          {/* Google Maps Embed */}
          <div className="mt-6">
            <iframe
              width="100%"
              height="300"
              frameBorder="0"
              style={{ border: 0, borderRadius: "12px" }}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${spot.parameters}`}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="mt-6">
          {spot.requiredbooking ? (
            <button
              onClick={() => {
                if (!isSignedIn) {
                  alert("Please sign in to continue booking.");
                  window.open("/sign-in", "_blank");
                } else {
                  window.location.href = `/spots/${spot.spotId}/book`;
                }
              }}
              className="w-full inline-block  text-gray-600 font-semibold py-1 px-4 rounded-lg transition hover:bg-green-300 text-center"
            >
              Book Now
            </button>
          ) : (
            <span className="w-full inline-block text-gray-600 font-semibold py-2 px-4 rounded-lg transition hover:bg-gray-200 text-center">
              No Booking Required
            </span>
          )}
        </div>

        <ReviewsComponent itemType="spot" itemId={spotId} />
      </div>
    </div>
  );
}

{
  /*ChatGPT Prompt
  please also help to improve the css for below using tailwind css and next.js. This is only one data and presented to public, so it need to be eye-catching/ creative */
}
