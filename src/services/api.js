const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Store token in localStorage
export const setToken = (token) => {
  localStorage.setItem('auth_token', token)
}

export const getToken = () => {
  return localStorage.getItem('auth_token')
}

export const removeToken = () => {
  localStorage.removeItem('auth_token')
}

// Store user data
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const removeUser = () => {
  localStorage.removeItem('user')
}

// API call helper
const apiCall = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const data = await apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    // Store token and user
    setToken(data.token)
    setUser(data.user)

    return data
  },

  logout: async () => {
    try {
      await apiCall('/logout', { method: 'POST' })
    } finally {
      removeToken()
      removeUser()
    }
  },

  getUser: async () => {
    return apiCall('/user')
  },
}

// Admin API - Professors
export const adminProfessorsAPI = {
  list: (page = 1) => apiCall(`/admin/professeurs?page=${page}`),
  create: (data) => apiCall('/admin/professeurs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  show: (id) => apiCall(`/admin/professeurs/${id}`),
  update: (id, data) => apiCall(`/admin/professeurs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/admin/professeurs/${id}`, { method: 'DELETE' }),
}

// Admin API - Filières
export const adminFilieresAPI = {
  list: (page = 1) => apiCall(`/admin/filieres?page=${page}`),
  create: (data) => apiCall('/admin/filieres', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  show: (id) => apiCall(`/admin/filieres/${id}`),
  update: (id, data) => apiCall(`/admin/filieres/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/admin/filieres/${id}`, { method: 'DELETE' }),
}

// Admin API - Modules
export const adminModulesAPI = {
  list: (page = 1) => apiCall(`/admin/modules?page=${page}`),
  create: (data) => apiCall('/admin/modules', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  show: (id) => apiCall(`/admin/modules/${id}`),
  update: (id, data) => apiCall(`/admin/modules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/admin/modules/${id}`, { method: 'DELETE' }),
}

// Admin API - Matières
export const adminMatieresAPI = {
  list: (page = 1) => apiCall(`/admin/matieres?page=${page}`),
  create: (data) => apiCall('/admin/matieres', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  show: (id) => apiCall(`/admin/matieres/${id}`),
  update: (id, data) => apiCall(`/admin/matieres/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/admin/matieres/${id}`, { method: 'DELETE' }),
}

// Admin API - Groupes
export const adminGroupesAPI = {
  list: (page = 1) => apiCall(`/admin/groupes?page=${page}`),
  create: (data) => apiCall('/admin/groupes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  show: (id) => apiCall(`/admin/groupes/${id}`),
  update: (id, data) => apiCall(`/admin/groupes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/admin/groupes/${id}`, { method: 'DELETE' }),
}

// Admin API - Assignments
export const adminAssignmentsAPI = {
  list: (page = 1) => apiCall(`/admin/assignments?page=${page}`),
  create: (data) => apiCall('/admin/assignments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/admin/assignments/${id}`, { method: 'DELETE' }),
}

// Admin API - Logbooks
export const adminLogbooksAPI = {
  list: (page = 1) => apiCall(`/admin/logbooks?page=${page}`),
  validate: (id) => apiCall(`/admin/logbooks/${id}/validate`, { method: 'PUT' }),
  flag: (id, data) => apiCall(`/admin/logbooks/${id}/flag`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
}

// Professor API - Assignments
export const professorAssignmentsAPI = {
  myAssignments: () => apiCall('/professeur/my-assignments'),
}

// Professor API - Logbooks
export const professorLogbooksAPI = {
  list: () => apiCall('/professeur/my-logbooks'),
  create: (data) => apiCall('/professeur/logbooks', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}
