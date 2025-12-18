import axios from "axios";

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://rsvp-backend-1j8j.onrender.com/v1'
        : 'http://127.0.0.1:5000/v1',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
