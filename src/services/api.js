import axios from "axios";
import API_BASE_URL from "../config";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to every request if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------- Auth --------

export const register = (data) => api.post('/auth/register', data);

export const login = (data) => api.post('/auth/login', data);

// -------- User --------

export const getCurrentUser = () => api.get('/users/me');

export const getClinicInfo = () => api.get('/users/clinic');

// -------- Assets --------

export const getAssets = () => api.get('/assets');

export const getAssetById = (id) => api.get(`/assets/${id}`);

export const createAsset = (data) => api.post('/assets', data);

export const updateAsset = (id, data) => api.put(`/assets/${id}`, data);

export const deleteAsset = (id) => api.delete(`/assets/${id}`);

// -------- Licenses --------

export const getLicenses = () => api.get('/licenses');

export const getLicenseById = (id) => api.get(`/licenses/${id}`);

export const createLicense = (data) => api.post('/licenses', data);

export const updateLicense = (id, data) => api.put(`/licenses/${id}`, data);

export const deleteLicense = (id) => api.delete(`/licenses/${id}`);

// -------- Tickets --------

export const getTickets = () => api.get('/tickets');

export const getTicketById = (id) => api.get(`/tickets/${id}`);

export const createTicket = (data) => api.post('/tickets', data);

export const updateTicket = (id, data) => api.put(`/tickets/${id}`, data);

export const deleteTicket = (id) => api.delete(`/tickets/${id}`);

export default api;