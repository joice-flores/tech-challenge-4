import axios from 'axios';

const ENV_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: ENV_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let unauthorizedHandler: (() => void | Promise<void>) | null = null;

export function setUnauthorizedHandler(handler: (() => void | Promise<void>) | null) {
  unauthorizedHandler = handler;
}

api.interceptors.response.use(
  response => response,
  async error => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (unauthorizedHandler) {
        await unauthorizedHandler();
      }
    }

    return Promise.reject(error);
  },
);

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}
