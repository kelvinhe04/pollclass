const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function removeUser() {
  localStorage.removeItem('user');
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const config = {
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}`);
  }

  return data;
}

export const api = {
  register: (email, password, name, role) => 
    request('/api/auth/register', {
      method: 'POST',
      body: { email, password, name, role }
    }),

  login: (email, password) => 
    request('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    }),

  getMe: () => request('/api/auth/me'),

  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  isAuthenticated: () => !!getToken(),
  
  createPoll: (title, options) => 
    request('/api/polls', {
      method: 'POST',
      body: { title, options }
    }),

  getPolls: () => request('/api/polls'),

  getPollById: (id) => request(`/api/polls/${id}`),

  getPollByCode: (code) => request(`/api/polls/code/${code}`),

  getPollForStudent: (code) => request(`/api/polls/${code}/for-student`),

  closePoll: (id) => request(`/api/polls/${id}/close`, { method: 'PATCH' }),

  deletePoll: (id) => request(`/api/polls/${id}`, { method: 'DELETE' }),

  vote: (pollId, optionIndex, voterName) => 
    request(`/api/polls/${pollId}/vote`, {
      method: 'POST',
      body: { optionIndex, voterName }
    }),

  getResults: (pollId) => request(`/api/polls/${pollId}/results`),

  getStudentHistory: () => request('/api/student/history')
};

export default api;