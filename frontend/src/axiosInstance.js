import axios from 'axios';

export const BaseUrl = axios.create({
    baseURL: 'http://localhost:5000/api',
});

BaseUrl.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
