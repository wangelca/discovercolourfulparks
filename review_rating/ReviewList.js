import React, {useEffect, useState} from 'react';
import { getEventReviews, getSpotReviews } from './reviews';

const ReviewList = ({ eventId, spotId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            if (eventId) {
                const response = await getEventReviews(eventId);
                setReviews(response.data);
            } else if (spotId) {
                const response = await getSpotReviews(spotId);
                setReviews(response.data);
            }
        };
        fetchReviews();
    }, [eventId, spotId]);

    return (
        <div>
            <h3>Reviews</h3>
            {reviews.length === 0 ? (
                <p>No reviews yet</p>
            ) : (
                <ul>
                    {reviews.map(review => (
                        <li key={review.id}>
                            <strong>Rating:</strong> {review.rating} <br />
                            <strong>Comment:</strong> {review.comment}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
    
export default ReviewList;