import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// Courses
export const courseAPI = {
  getAll: (params) => API.get('/courses', { params }),
  getOne: (id) => API.get(`/courses/${id}`),
  create: (data) => API.post('/courses', data),
  update: (id, data) => API.put(`/courses/${id}`, data),
  delete: (id) => API.delete(`/courses/${id}`),
};

// Enrollment
export const enrollAPI = {
  enroll: (courseId) => API.post('/enroll', { courseId }),
  getUserEnrollments: (userId) => API.get(`/enroll/${userId}`),
  unenroll: (courseId) => API.delete(`/enroll/${courseId}`),
};

// Progress
export const progressAPI = {
  update: (courseId, lessonId) => API.put('/progress/update', { courseId, lessonId }),
  getUserProgress: (userId) => API.get(`/progress/${userId}`),
  getCourseProgress: (userId, courseId) => API.get(`/progress/${userId}/${courseId}`),
};

export default API;
