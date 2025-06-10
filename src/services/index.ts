import axios, { type InternalAxiosRequestConfig   } from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

const $host = axios.create({
    baseURL: API_URL
})

const optionalAuthInterceptor = (config: InternalAxiosRequestConfig ) => {
    const token = localStorage.getItem('token');

    if(token){
        config.headers!.Authorization = `Bearer ${token}`;
    }

    return config;
}

$host.interceptors.request.use(optionalAuthInterceptor);

const $authHost = axios.create({
    baseURL: API_URL
})

const authInterceptor = (config: InternalAxiosRequestConfig ) => {
    config.headers!.Authorization = `Bearer ${localStorage.getItem('token')}`;

    return config;
}

$authHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost
}