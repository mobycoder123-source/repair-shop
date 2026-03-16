import axios from 'axios';

const API_URL = 'https://mobycoder-repair-shop.hf.space/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  delete: (id) => api.delete(`/appointments/${id}`)
};

export const availabilityAPI = {
  get: (params) => api.get('/availability', { params }),
  create: (data) => api.post('/availability', data),
  delete: (id) => api.delete(`/availability/${id}`),
  createBulk: (dates) => api.post('/availability/bulk', { dates })
};

export const contentAPI = {
  getPage: (page, lang) => api.get(`/content/${page}`, { params: { lang } }),
  getSection: (page, section, lang) => api.get(`/content/${page}/${section}`, { params: { lang } }),
  create: (data) => api.post('/content', data),
  update: (id, data) => api.put(`/content/${id}`, data),
  delete: (id) => api.delete(`/content/${id}`)
};

export const contactAPI = {
  getAll: (params) => api.get('/contact', { params }),
  create: (data) => api.post('/contact', data),
  updateStatus: (id, status) => api.patch(`/contact/${id}/status`, { status }),
  delete: (id) => api.delete(`/contact/${id}`)
};

export const feedbackAPI = {
  getAll: (params) => api.get('/feedback', { params }),
  create: (data) => api.post('/feedback', data),
  updateStatus: (id, status) => api.patch(`/feedback/${id}/status`, { status }),
  delete: (id) => api.delete(`/feedback/${id}`)
};

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  register: (data) => api.post('/admin/register', data),
  me: () => api.get('/admin/me')
};

export default api;
