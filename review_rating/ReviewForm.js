import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ type, id }) => {
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = type === "spot" ? `/spots/reviews/` : `/events/reviews/`;
    try {
      await axios.post(url, { [`${type}_id`]: id, rating, review });
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Rating:
        <input type="number" value={rating} onChange={e => setRating(e.target.value)} min="1" max="5" />
      </label>
      <label>Review:
        <textarea value={review} onChange={e => setReview(e.target.value)} />
      </label>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;