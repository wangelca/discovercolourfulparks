// references : chatGPT: form for users to submit reviews
import React, { useState } from 'react';
import { createReview } from './reviews'; 

const ReviewForm = ({ event_id, spotId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createReview({ rating, comment, event_id: event_Id, spot_id: spotId });
    setRating(0);
    setComment("");
    alert("Review submitted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>
      <div>
        <label>Rating: </label>
        <input type='number' value={rating} onChange={e => setRating(e.target.value)} min="0" max="5" step="0.5" />
      </div>
      <div>
        <label>Comment: </label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} />
      </div>
      <button type='submit'>Submit</button>
    </form>
  );
};

export default ReviewForm;