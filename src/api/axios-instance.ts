import axios, { AxiosError } from 'axios';

// We would normally use env vars for this so that multiple environments can be supported
const API_BASE_ORIGIN = 'https://api.sandbox.bvnk.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_ORIGIN,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    indexes: null,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // We would normally add auth tokens and retry logic here
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
    // This is where we would add Sentry error tracking

    return Promise.reject(error);
  },
);

export { axiosInstance };
