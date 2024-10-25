//references: ChatGPT
import React, { useState, useEffect } from "react";
import { Link } from 'next/link';


export default function SpotList() {
    const [spots, setSpots] = useState([]); // Initialize with an empty array
  
    useEffect(() => {
      fetch("http://localhost:8000/spots") 
        .then((response) => response.json())
        .then((data) => setSpots(data))
        .catch((error) => console.error("Error fetching spots:", error));
    }, []);


    return (
        <div>
            <h1>Spots</h1>
            <ul>
                {spots.map(spot => (
                    <li key={spot.spotId}>
                        <h2>{spot.spotName}</h2>
                        {/* Link to the detailed spot page */}
                        <Link to={`/spots/${spot.spotId}`}>View Details and Reviews</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
    }