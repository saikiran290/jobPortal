import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.MODE === 'development'
    ? 'http://localhost:8000'
    : 'https://jobportal-8vla.onrender.com',
  withCredentials: true,
});

export default API;
