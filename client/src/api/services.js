import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) => api.post('/users/upload-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadResume: (formData) => api.post('/users/upload-resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const companyAPI = {
  getMe: () => api.get('/companies/me'),
  updateMe: (data) => api.put('/companies/me', data),
  uploadLogo: (formData) => api.post('/companies/me/upload-logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getById: (id) => api.get(`/companies/${id}`),
};

export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  getMyCompanyJobs: () => api.get('/jobs/company/mine'),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

export const applicationAPI = {
  apply: (jobId) => api.post('/applications', { jobId }),
  getMyApplications: () => api.get('/applications/me'),
  withdraw: (id) => api.delete(`/applications/${id}`),
  getByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
};
