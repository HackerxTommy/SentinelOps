import axios from 'axios';

// In development: requests go through Vite's dev proxy (/api → localhost:5000/api).
// In production (Vercel): requests go to the deployed server via VITE_API_URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send HttpOnly session cookie on every request
});

// Handle 401 — redirect to /auth ONLY when a protected-resource call fails
// (i.e. session expired while user was on a dashboard page).
// Auth endpoints (/auth/me, /auth/login, etc.) are excluded because their 401s
// are expected for unauthenticated visitors and handled by AuthContext.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthEndpoint = url.startsWith('/auth');
    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      !window.location.pathname.startsWith('/auth')
    ) {
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
};

export const scanAPI = {
  create: (data) => api.post('/scans', data),
  list: () => api.get('/scans'),
  get: (id) => api.get(`/scans/${id}`),
  getFindings: (id) => api.get(`/scans/${id}/findings`),
  getLogs: (id) => api.get(`/scans/${id}/logs`),
  getReconData: (id) => api.get(`/scans/${id}/recon`),
  cancel: (id) => api.patch(`/scans/${id}/cancel`),
  delete: (id) => api.delete(`/scans/${id}`),
  getAnalytics: () => api.get('/scans/analytics/dashboard'),
};

export const chatAPI = {
  list: () => api.get('/chat'),
  get: (id) => api.get(`/chat/${id}`),
  create: (data) => api.post('/chat', data),
  sendMessage: (id, content) => api.post(`/chat/${id}/messages`, { content }),
  delete: (id) => api.delete(`/chat/${id}`),
};

export const issueAPI = {
  list: (params) => api.get('/issues', { params }),
  get: (id) => api.get(`/issues/${id}`),
  update: (id, data) => api.patch(`/issues/${id}`, data),
  getStats: () => api.get('/issues/stats/summary'),
  addComment: (id, text) => api.post(`/issues/${id}/comments`, { text }),
  requestAutoFix: (id, code) => api.post(`/issues/${id}/autofix`, { code }),
  bulkUpdateStatus: (issueIds, status) => api.patch('/issues/bulk/status', { issueIds, status }),
};

export const repoAPI = {
  list: () => api.get('/repos'),
  add: (data) => api.post('/repos', data),
  delete: (id) => api.delete(`/repos/${id}`),
};

export const domainAPI = {
  list: () => api.get('/domains'),
  add: (data) => api.post('/domains', data),
  delete: (id) => api.delete(`/domains/${id}`),
};

export const reportAPI = {
  list: () => api.get('/reports'),
  get: (id) => api.get(`/reports/${id}`),
  generate: (scanId, type) => api.post('/reports/generate', { scanId, type }),
  download: (id) => api.get(`/reports/${id}/download`, { responseType: 'blob' }),
};

export const codeReviewAPI = {
  listGithubRepos: (page) => api.get('/code-review/github/repos', { params: { page } }),
  listPRs: (owner, repo) => api.get(`/code-review/github/${owner}/${repo}/prs`),
  reviewPR: (owner, repo, prNumber, postComment = false) =>
    api.post(`/code-review/github/${owner}/${repo}/prs/${prNumber}/review`, { postComment }),
  scanRepo: (owner, repo, branch) =>
    api.post(`/code-review/github/${owner}/${repo}/scan`, null, { params: { branch } }),
};

export const billingAPI = {
  getSubscription: () => api.get('/billing/subscription'),
  createOrder: (planId) => api.post('/billing/create-order', { planId }),
  verifyPayment: (data) => api.post('/billing/verify', data),
};

export const scheduledPentestAPI = {
  list: () => api.get('/scheduled-pentests'),
  create: (data) => api.post('/scheduled-pentests', data),
  update: (id, data) => api.patch(`/scheduled-pentests/${id}`, data),
  delete: (id) => api.delete(`/scheduled-pentests/${id}`),
};

export const attackSurfaceAPI = {
  list: () => api.get('/attack-surface'),
};

export default api;
