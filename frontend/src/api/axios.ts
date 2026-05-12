// src/api/axios.ts
import axios from 'axios';

export const apiClient = axios.create({
  // baseURL: 'https://api-charite.mouadabbassid.com/api/v1',
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Check if the request URL is for login or register
    const isAuthRoute =
      config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

    // Only attach the token if we have one AND we are not trying to log in/register
    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
