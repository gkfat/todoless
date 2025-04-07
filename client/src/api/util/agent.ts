import axios, {
    AxiosError,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
} from 'axios';

import { store } from '../../store';

const beforeRequestInterceptor = async (config: InternalAxiosRequestConfig) => {
    const { token } = store.getState().auth;

    if (token) {
        config.headers['authorization'] = `Bearer ${token}`;
    }

    return config;
};

const errorHandler = async (error: AxiosError) => {
    if (error?.response?.status) {
        if (error.response.status === 403) {
            window.location.href = '/sign-in';
        }
    }

    throw error;
};

axios.interceptors.request.use(beforeRequestInterceptor, (error) => Promise.reject(error));
axios.interceptors.response.use((response) => response, errorHandler);

export const request = (apiBase: string) => {
    const requestAsync = async (args: {
        method: 'GET'|'POST'|'DELETE'|'PUT',
        url: string,
        params?: URLSearchParams,
        data?: object
        customHeaders?: { [key: string]: string }
    }) => {
        const baseURL: string = `${import.meta.env.VITE_API_URL}${apiBase}`;

        const req: AxiosRequestConfig = {
            baseURL,
            method: args.method,
            url: args.url,
            params: args.params,
            data: args.data,
            timeout: 60000,
        };

        const res = await axios(req);
        return res.data;
    };

    return requestAsync;
};
