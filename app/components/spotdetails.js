'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SpotDetails() {
  const { spotId } = useParams(); // Get dynamic route params
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    if (spotId) {
      axios.get(`/api/spot/${spotId}`)
        .then((response) => {
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

<iframe
  width="450"
  height="250"
  frameBorder="0"
  style={{ border: 0 }}
  referrerPolicy="no-referrer-when-downgrade"
  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${spot.parameters}`}
  allowFullScreen
></iframe>



    </div>
  );
}
