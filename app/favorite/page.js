'use client';

import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState({ favoriteEvents: [], favoriteSpots: [] });
  const [error, setError] = useState(null);

  const userId = 1; // Example user ID

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users/${userId}/favorites`);
        if (!res.ok) {
          throw new Error("Failed to fetch user favorites");
        }
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFavorites();
  }, [userId]);

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">User Favorites</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Favorite Events</h2>
        {favorites.favoriteEvents.length === 0 ? (
          <p className="text-gray-600">No favorite events found.</p>
        ) : (
          <div className="space-y-4">
            {favorites.favoriteEvents.map((event) => (
              <div key={event.eventId} className="p-4 border rounded-md shadow-sm">
                <h3 className="text-xl font-semibold">{event.eventName}</h3>
                <p className="text-gray-700">Location: {event.eventLocation}</p>
                <p className="text-sm text-gray-500">Fee: {event.fee}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Favorite Spots</h2>
        {favorites.favoriteSpots.length === 0 ? (
          <p className="loading-text">No favorite spots found.</p>
        ) : (
          <div className="space-y-4">
            {favorites.favoriteSpots.map((spot) => (
              <div key={spot.spotId} className="p-4 border rounded-md shadow-sm">
                <h3 className="text-xl font-semibold">{spot.spotName}</h3>
                <p className="text-gray-700">Location: {spot.spotLocation}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
