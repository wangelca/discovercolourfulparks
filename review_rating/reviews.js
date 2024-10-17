import axios from "axios";

const API_URL = 'http://localhost:8000';

export const createReview = async (review) => {
  return axios.post(`${API_URL}/reviews/`, review);
};

export const getEventReviews = async (eventId) => {
  return axios.get(`${API_URL}/reviews/event/${eventId}`);
};

export const getSpotReviews = async (spotId) => {
  return axios.get(`${API_URL}/reviews/spot/${spotId}`);
}



