import axios from 'axios';

const API_URL = 'http://localhost:5000/api/comments/';

export const getComments = (postId) => {
  return axios.get(API_URL + postId);
};

export const addComment = (postId, commentData, token) => {
  return axios.post(API_URL + postId, commentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
