import axios from 'axios';

const apiurl = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const BaseUrl = axios.create({
    baseURL: apiurl,
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
