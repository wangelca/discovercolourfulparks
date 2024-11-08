import React, { useState, useEffect } from 'react';

const PopularSpots = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    // Fetch popular spots from FastAPI
    const fetchSpots = async () => {
      try {
        const response = await fetch(`http://localhost:8000/spots?category=${category}`);
        const data = await response.json();
        setSpots(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching spots:', error);
        setLoading(false);
      }
    };

    fetchSpots();
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Popular Spots</h1>
      <div>
        <label htmlFor="category">Choose a category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="nature">Nature</option>
          <option value="historic">Historic</option>
          <option value="recreational">Recreational</option>
          {/* Add more categories as needed */}
        </select>
      </div>
      <ul>
        {spots.map((spot) => (
          <li key={spot.spotId}>
            <h2>{spot.spotName}</h2>
            <p>{spot.spotDescription}</p>
            <img src={spot.spotImageUrl} alt={spot.spotName} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularSpots;
