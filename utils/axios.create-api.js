import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const createApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default createApi;
