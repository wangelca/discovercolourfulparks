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
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Spot Name</th>
            <th>Hourly Rate</th>
            <th>Description</th>
            <th>Location</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {spots.length > 0 ? (
            spots.map((spot) => (
              <tr key={spot.spotId}>
                                <td>
                  {spot.spotImageUrl && (
                    <img
                      src={spot.spotImageUrl}
                      alt={`Image of ${spot.spotName}`}
                      style={{ width: '100px', height: 'auto', borderRadius: '8px' }}
                    />
                  )}
                </td>
                <td>{spot.spotName}</td>
                <td>{spot.spotHourlyRate}</td>
                <td>{spot.spotDescription}</td>
                <td>{spot.spotLocation}</td>
                <td>
                  <a href={`/spots/${spot.spotId}`}>View</a></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No spots found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
