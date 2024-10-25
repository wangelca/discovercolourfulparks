// references : chatGPT: functions to interact with the backend API.
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const addReview = async (review) => {
    const response = await axios.post(`${API_URL}/reviews/`, review);
    return response.data;
};

export const getReviewsByItem = async (itemType, itemId) => {
    const response = await axios.get(`${API_URL}/reviews/${itemType}/${itemId}`);
    return response.data;
};

export const getAverageRating = async (itemType, itemId) => {
    const response = await axios.get(`${API_URL}/ratings/${itemType}/${itemId}`);
    return response.data;
};




