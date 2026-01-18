import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Default to 5000 if not set
    withCredentials: true, // IMPORTANT: Sends cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If we get a 401, it might mean the session expired.
            // We could trigger a logout action here or just pass it to the component.
            // For a sovereign platform, being explicit is good.
            console.warn('Unauthorized access - Session might be expired');
        }
        return Promise.reject(error);
    }
);

export default api;
