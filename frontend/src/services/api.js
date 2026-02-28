import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (credentials) => api.post('/auth/register', credentials),
};

export const memoryAPI = {
    getMemories: () => api.get('/memories/'),
    getMemory: (id) => api.get(`/memories/${id}`),
    createMemory: (formData) => api.post('/memories/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    askAI: (query) => api.get('/memories/ask-ai/', { params: { query } }),
};

export const insightAPI = {
    getInsights: () => api.get('/insights/'),
    generateWeekly: () => api.post('/insights/generate-weekly'),
};

export default api;
