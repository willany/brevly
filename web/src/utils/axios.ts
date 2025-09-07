import axios, { AxiosError } from 'axios';

import { API_CONFIG } from '../config/api';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
  validateStatus: status => status >= 200 && status < 300,
});

export type { AxiosError };

export default apiClient;
