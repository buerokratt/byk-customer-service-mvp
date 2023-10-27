import axios from 'axios';
import { RuuterResponse } from '../model/ruuter-response.model';

const ruuterUrl = window._env_.RUUTER_API_URL;
const timUrl = window._env_.TIM_API_URL;

const http = axios.create({
  baseURL: ruuterUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

http.interceptors.response.use((response) => {
  if (response.status === 200) {
    if (!response.data) {
      return Promise.reject(new Error('200 OK with no response body!'));
    }
    const ruuterResponse = response.data as RuuterResponse;
    if (ruuterResponse.error) {
      return Promise.reject(new Error(ruuterResponse.error));
    }
    if (ruuterResponse.data) {
      return Object.values(ruuterResponse.data)[0];
    }
  }
  return response;
});

export const customJwtAxios = axios.create({
  baseURL: timUrl,
  headers: { 'Content-Type': 'text/plain' },
  withCredentials: true,
});

export default http;
