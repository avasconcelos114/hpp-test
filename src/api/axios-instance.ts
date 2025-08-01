import axios, { AxiosError } from 'axios';

// META: We would normally use env vars for this so that multiple environments can be supported
const API_BASE_ORIGIN = 'https://api.sandbox.bvnk.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_ORIGIN,
  headers: {
    'Content-Type': 'application/json',
  },
  adapter: 'fetch', // Using fetch to ensure interopetability with Next.js
  paramsSerializer: {
    indexes: null,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // META: We would normally inject auth tokens and auth refresh logic here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // META: This is where we would add Sentry error tracking

    return Promise.reject(error);
  },
);

export { axiosInstance };
