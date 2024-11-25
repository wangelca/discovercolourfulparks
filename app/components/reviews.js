import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const API_URL = "http://localhost:8000"; // Update this if deployed

const ReviewsComponent = ({ itemType, itemId }) => {
  const [reviews, setReviews] = useState([]);
  const { isLoaded, isSignedIn, user } = useUser(); // Access loading and sign-in state
  const [averageRating, setAverageRating] = useState(null);
  const [newReview, setNewReview] = useState({ rating: "", review: "" });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const [profileData, setProfileData] = useState({
    emailAddress: "",
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return; // Ensure user is loaded and signed in
    fetch(`http://localhost:8000/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch((error) =>
        console.error("Error fetching profile detaisl:", error)
      );
  }, [user, isLoaded, isSignedIn]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/reviews/${itemType}/${itemId}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/ratings/${itemType}/${itemId}`
        );
        setAverageRating(response.data.average_rating);
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    fetchReviews();
    fetchAverageRating();
  }, [itemType, itemId]);

  const handleAddReview = async () => {
    if (!newReview.rating || !newReview.review) {
      setError("Please enter both a rating and a comment.");
      return;
    }
    setError("");

    const reviewData = {
      rating: parseInt(newReview.rating, 10),
      review: newReview.review,
      ...(itemType === "event" ? { event_id: itemId } : { spot_id: itemId }),
      id: profileData.id,
    };

    try {
      const response = await axios.post(`${API_URL}/reviews`, reviewData);
      setReviews([...reviews, response.data]);
      setNewReview({ rating: "", review: "" });
      fetchAverageRating();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  // Interactive star rating
  const renderInteractiveStars = () => (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`cursor-pointer text-3xl ${
            index < newReview.rating ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => setNewReview({ ...newReview, rating: index + 1 })}
        >
          ★
        </span>
      ))}
    </div>
  );

// Dynamic star rating display based on the review's rating
const renderStars = (rating) => (
    <div className="flex">
        {[...Array(5)].map((_, index) => (
            <span
                key={index}
                style={{ color: index < rating ? "#FFD700" : "#E0E0E0" }} // Yellow for filled stars, grey for empty
                className="text-3xl"
            >
                ★
            </span>
        ))}
    </div>
);


  // Pagination handling
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {averageRating !== null ? (
        <div className="flex items-center mb-4">
          <span className="text-lg font-semibold mr-2">Average Rating:</span>
          {renderStars(Math.round(averageRating))}
          <span className="text-lg ml-2">({averageRating.toFixed(1)} / 5)</span>
        </div>
      ) : (
        <p className="text-gray-600">
          Please leave your first review for this {itemType}.
        </p>
      )}

      <ul className="mb-6">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <li key={review.reviewId} className="mb-4 border-b pb-2">
              <div className="flex items-center">
                {renderStars(Math.round(review.rating))}
                <span className="ml-2 text-gray-700">{review.rating} / 5</span>
              </div>
              <p className="text-gray-600 mt-2">{review.review}</p>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center my-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Conditionally Render Review Section */}
      <div className="bg-gray-50 p-4 rounded-lg shadow mt-4">
        <h3 className="text-lg font-bold mb-2">Leave a Review</h3>
        {isSignedIn ? (
          <>
            <div className="mb-2">
              <label className="block text-gray-700">Rating:</label>
              {renderInteractiveStars()}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Comment:</label>
              <textarea
                name="review"
                value={newReview.review}
                onChange={(e) =>
                  setNewReview({ ...newReview, review: e.target.value })
                }
                className="border p-2 rounded w-full"
                rows="3"
                required
              ></textarea>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              onClick={handleAddReview}
              className="bg-amber-500 text-white font-bold py-2 px-4 rounded hover:bg-amber-600"
            >
              Submit Review
            </button>
          </>
        ) : (
          <p className="text-gray-600">Please log in to leave a review.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewsComponent;
