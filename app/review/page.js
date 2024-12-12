'use client';

import { useEffect, useState } from "react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  const userId = 1; // Example user ID

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users/${userId}/reviews`);
        if (!res.ok) {
          throw new Error("Failed to fetch user reviews");
        }
        const data = await res.json();
        setReviews(data.reviews);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchReviews();
  }, [userId]);

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">User Reviews</h1>
      
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews found.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.reviewId} className="p-4 border rounded-md shadow-sm">
              <div className="mb-2">
                <p className="font-semibold">Rating: {rev.rating}</p>
                <p className="text-sm text-gray-600">Review: {rev.review}</p>
              </div>
              {rev.event && (
                <div className="mb-2">
                  <h3 className="text-lg font-bold">Event Reviewed:</h3>
                  <p>{rev.event.eventName}</p>
                  <p className="text-sm text-gray-600">Location: {rev.event.eventLocation}</p>
                </div>
              )}
              {rev.spot && (
                <div>
                  <h3 className="text-lg font-bold">Spot Reviewed:</h3>
                  <p>{rev.spot.spotName}</p>
                  <p className="text-sm text-gray-600">Location: {rev.spot.spotLocation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
