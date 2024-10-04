import React, { useState, useEffect } from 'react';

export default function Spots() {
  const [spots, setSpots] = useState([]); // Initialize with an empty array

  useEffect(() => {
    fetch('http://localhost:8000/spots')  // Update with your FastAPI endpoint
      .then((response) => response.json())
      .then((data) => setSpots(data))
      .catch((error) => console.error('Error fetching spots:', error));
  }, []);

  return ( 
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Spots</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.length > 0 ? (
          spots.map((spot) => (
            <div
              key={spot.spotId}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                {spot.spotImageUrl && (
                  <img
                    src={spot.spotImageUrl}
                    alt={`Image of ${spot.spotName}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{spot.spotName}</h2>
                <p className="text-gray-700">
                  <strong>Hourly Rate: </strong> {spot.spotHourlyRate}
                </p>
                <p className="text-gray-600 mt-2">{spot.spotDescription}</p>
                <p className="text-gray-700 mt-2">
                  <strong>Location: </strong> {spot.spotLocation}
                </p>
                <a
                  href={`/spots/${spot.spotId}`}
                  className="mt-4 inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-blue-600"
                >
                  View Details
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-lg font-medium text-gray-500">
            No spots found.
          </div>
        )}
      </div>
    </div>

  );
}
