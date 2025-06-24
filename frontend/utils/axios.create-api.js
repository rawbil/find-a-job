import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const createApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor to add token to requests
createApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
createApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            // Throw a custom error that can be caught by components
            handleTokenExpiration()
            throw new Error('TOKEN_EXPIRED');
        }
        return Promise.reject(error);
    }
);

// Export a function to handle token expiration in components
export const handleTokenExpiration = () => {
    // Clear token and user data
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    // Get the current location
    const currentPath = window.location.pathname;
    
    // Redirect to login unless we're already on the login page
    if (currentPath !== '/auth') {
        window.location.href = '/auth';
    }
};

export default createApi;
