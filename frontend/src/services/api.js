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
    updateMemory: (id, formData) => api.put(`/memories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteMemory: (id) => api.delete(`/memories/${id}`),
    askAI: (query) => api.get('/memories/ask-ai/', { params: { query } }),
    exportMemories: () => api.get('/memories/export'),
};

export const profileAPI = {
    getMe: () => api.get('/profiles/me'),
    updateMe: (data) => api.put('/profiles/me', data),
};

export const insightAPI = {
    getInsights: () => api.get('/insights/'),
    generateInsight: (period, startDate, endDate) => {
        let url = `/insights/generate?period=${period}`;
        if (startDate && endDate) {
            url += `&start_date=${startDate}&end_date=${endDate}`;
        }
        return api.post(url);
    },
    deleteInsight: (id) => api.delete(`/insights/${id}`)
};

export default api;
