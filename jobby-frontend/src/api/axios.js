import axios from 'axios';

const API = axios.create({
  baseURL: 'https://jobby-backend-t8n0.onrender.com/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('jobby_token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;