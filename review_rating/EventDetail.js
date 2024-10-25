// references : chatGPT: functions to interact with the backend API.
import React, { useState, useEffect } from 'react';
import { addReview, getReviewsByItem, getAverageRating } from '../review_rating/reviews'; 

const EventDetails = ({ match }) => {
    const eventId = match.params.id;  // Get the event ID from URL params
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [newReview, setNewReview] = useState({ rating: '', review: '' });

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        const reviewsData = await getReviewsByItem("event", eventId);
        setReviews(reviewsData);

        const avgRatingData = await getAverageRating("event", eventId);
        setAverageRating(avgRatingData.average_rating);
    };

    const handleReviewChange = (e) => {
        setNewReview({ ...newReview, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reviewData = { ...newReview, event_id: eventId, type: "event", user_id: 1 };  // User_id should be dynamic
        await addReview(reviewData);
        loadReviews();  // Reload reviews after submission
    };

    return (
        <div>
            <h1>Event Details</h1>
            <h2>Average Rating: {averageRating}</h2>

            <form onSubmit={handleSubmit}>
                <label>
                    Rating:
                    <input type="number" name="rating" value={newReview.rating} onChange={handleReviewChange} min="1" max="5" required />
                </label>
                <label>
                    Review:
                    <textarea name="review" value={newReview.review} onChange={handleReviewChange}></textarea>
                </label>
                <button type="submit">Submit Review</button>
            </form>

            <h3>Reviews:</h3>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <strong>Rating:</strong> {review.rating}
                        <p>{review.review}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventDetails;



