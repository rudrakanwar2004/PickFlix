import axios from 'axios';
import { ACCESS_TOKEN } from "./constants";

const conn_url = '/choreo-apis/pickflixupdate/backend/v1'
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL : conn_url,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
