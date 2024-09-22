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
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Park Name</th>
            <th>Description</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {parks.length > 0 ? (
            parks.map((park) => (
              <tr key={park.parkId}>
                <td>{park.name}</td>
                <td>{park.description}</td>
                <td>{park.location}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>No parks found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
