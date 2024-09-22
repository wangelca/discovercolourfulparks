import { useState, useEffect } from 'react';

export default function Parks() {
  const [parks, setParks] = useState([]); // Initialize with an empty array

  useEffect(() => {
    fetch('/api/park') // Fetch from the correct API endpoint for parks
      .then((response) => response.json())
      .then((data) => setParks(data))
      .catch((error) => console.error('Error fetching parks:', error));
  }, []);

  return (
    <div>
      <h1>Parks</h1>
      <ul>
        {parks.length > 0 ? ( // Check if parks exist before mapping
          parks.map((park) => (
            <li key={park.parkId}>
              Park Name: {park.name}, Description: {park.description}
            </li>
          ))
        ) : (
          <p>No parks found.</p> // Display a message if no parks are available
        )}
      </ul>
    </div>
  );
}
