'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SpotDetails() {
  const { spotId } = useParams(); // Get dynamic route params
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    if (spotId) {
      console.log('API Request URL:', `/api/spot/${spotId}`);
      axios.get(`/api/spot/${spotId}`)
        .then((response) => {
          console.log('API Response:', response.data);
          setSpot(response.data);
        })
        .catch((error) => {
          console.error('Error fetching spot details:', error);
        });
    }
  }, [spotId]);

  if (!spot) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{spot.spotName}</h1>
      <p><strong>Location:</strong> {spot.spotLocation}</p>
      <p><strong>Description:</strong> {spot.spotDescription}</p>
      <p><strong>Hourly Rate:</strong> ${spot.spotHourlyRate}</p>
      <p><strong>Discount:</strong> {spot.spotDiscount}%</p>
    </div>
  );
}
