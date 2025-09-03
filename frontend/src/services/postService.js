import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts/';

export const getPosts = () => {
  return axios.get(API_URL);
};

export const createPost = (postData, token) => {
  return axios.post(API_URL, postData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
