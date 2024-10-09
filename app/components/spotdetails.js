'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import PlaceGallerySpot from './googlePhotoSpot';

export default function SpotDetails() {
  const { spotId } = useParams(); // Get dynamic route params
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <div>Loading...</div>;
  }

  return (    
<div className="container mx-auto p-6">
  <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
    {/* Spot Image */}
    {spot.spotImageUrl && (
      <img
        src={spot.spotImageUrl}
        alt={`Image of ${spot.spotName}`}
        className="w-full h-64 object-cover"
      />
    )}

    {/* Spot Content */}
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{spot.spotName}</h1>
      
      <div className="flex flex-col space-y-4">
        <p className="text-lg">
          <strong className="font-semibold">Location:</strong> {spot.spotLocation}
        </p>
        <p className="text-lg">
          <strong className="font-semibold">Description:</strong> {spot.spotDescription}
        </p>
        <p className="text-lg">
          <strong className="font-semibold">Hourly Rate:</strong> 
          <span className="text-green-600 font-bold"> ${spot.spotHourlyRate}</span>
        </p>
        <p className="text-lg">
          <strong className="font-semibold">Discount:</strong> 
          <span className="text-red-600 font-bold"> {spot.spotDiscount}%</span>
        </p>
      </div>

      {/* Google Maps Embed */}
      <div className="mt-6">
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          style={{ border: 0, borderRadius: '12px' }}
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${spot.parameters}`}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </div>
</div>

  );
}

{/*ChatGPT Prompt
  please also help to improve the css for below using tailwind css and next.js. This is only one data and presented to public, so it need to be eye-catching/ creative */}