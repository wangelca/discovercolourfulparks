import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Update this if deployed

const ReviewsComponent = ({ itemType, itemId }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);

    useEffect(() => {
        // Fetch reviews for the item directly from API
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${API_URL}/reviews/${itemType}/${itemId}`);
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        // Fetch average rating directly from API
        const fetchAverageRating = async () => {
            try {
                const response = await axios.get(`${API_URL}/ratings/${itemType}/${itemId}`);
                setAverageRating(response.data.average_rating);
            } catch (error) {
                console.error("Error fetching average rating:", error);
            }
        };

        fetchReviews();
        fetchAverageRating();
    }, [itemType, itemId]);

    // Directly post a new review to the API
    const handleAddReview = async (reviewData) => {
        try {
            const response = await axios.post(`${API_URL}/reviews/`, reviewData);
            setReviews([...reviews, response.data]);
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    return (
        <div>
            <h2>Reviews</h2>
            {averageRating !== null && (
                <p>Average Rating: {averageRating.toFixed(1)} / 5</p>
            )}
            <ul>
                {reviews.map(review => (
                    <li key={review.id}>{review.review} - {review.rating} stars</li>
                ))}
            </ul>
            <button onClick={() => handleAddReview({ /* your review data here */ })}>
                Add Review
            </button>
        </div>
    );
};

export default ReviewsComponent;
