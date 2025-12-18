import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/v1",
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        // Check localStorage or cookies for token. 
        // Backend uses cookies, but we might want to store it in localStorage for easy access in React or just rely on cookie automatic sending if `credentials: true` is set.
        // Given the login controller sends a token in the body AND sets a cookie, let's use the one in localStorage if we decide to store it there, 
        // or just rely on the cookie if the backend is on the same domain or properly CORS configured.
        // However, the backend code `req.headers.authorization?.split(' ')[1]` suggests it looks for a header too.
        // Let's store in localStorage for simplicity in this implementation plan.

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
