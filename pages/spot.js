import { useState, useEffect } from 'react';

export default function Spots() {
  const [spots, setSpots] = useState([]); // Initialize with an empty array

  useEffect(() => {
    fetch('/api/spot')
      .then((response) => response.json())
      .then((data) => setSpots(data))
      .catch((error) => console.error('Error fetching spots:', error));
  }, []);

  return (
    <div>
      <h1>Spots</h1>
      <ul>
        {spots.length > 0 ? ( // Check if spots exist before mapping
          spots.map((spot) => (
            <li key={spot.spotId}>
              Spot Name: {spot.spotName}, Hourly Rate: {spot.spotHourlyRate}
            </li>
          ))
        ) : (
          <p>No spots found.</p> // Display a message if no spots are available
        )}
      </ul>
    </div>
  );
}
