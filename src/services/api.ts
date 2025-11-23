import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = async (email: string, password: string, name?: string) => {
  const response = await api.post('/auth/register', { email, password, name });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Metrics
export const getMetrics = async () => {
  const response = await api.get('/metrics');
  return response.data;
};

export const getMetricsByCategory = async (category: string) => {
  const response = await api.get(`/metrics/${category}`);
  return response.data;
};

export default api;