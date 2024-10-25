import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Update this if deployed

const SpotDetails = () => {
    const { spotId } = useParams(); // Get dynamic route params
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [newReview, setNewReview] = useState({ rating: '', review: '' });

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            // Fetch reviews for the spot directly from API
            const reviewsResponse = await axios.get(`${API_URL}/reviews/spot/${spotId}`);
            setReviews(reviewsResponse.data);

            // Fetch average rating directly from API
            const ratingResponse = await axios.get(`${API_URL}/ratings/spot/${spotId}`);
            setAverageRating(ratingResponse.data.average_rating);
        } catch (error) {
            console.error("Error loading reviews or average rating:", error);
        }
    };

    const handleReviewChange = (e) => {
        setNewReview({ ...newReview, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const reviewData = {
                ...newReview,
                spot_id: spotId,
                type: "spot",
                user_id: 1,  // Replace with dynamic user ID
            };
            // Add review directly to API
            await axios.post(`${API_URL}/reviews/`, reviewData);
            setNewReview({ rating: '', review: '' });  // Reset form fields
            loadReviews();  // Reload reviews after submission
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <div>
            <h1>Spot Details</h1>
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

export default SpotDetails;
