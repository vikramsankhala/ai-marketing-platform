import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh on 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          const { token } = response.data.data
          localStorage.setItem('token', token)
          originalRequest.headers.Authorization = `Bearer ${token}`

          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export const authService = {
  // Login
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials)
    return response.data.data
  },

  // Register
  register: async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => {
    const response = await api.post('/auth/register', userData)
    return response.data.data
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data.data
  },

  // Update profile
  updateProfile: async (profileData: {
    firstName?: string
    lastName?: string
    phone?: string
    company?: string
  }) => {
    const response = await api.put('/auth/profile', profileData)
    return response.data.data
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string
    newPassword: string
  }) => {
    const response = await api.put('/auth/change-password', passwordData)
    return response.data
  },

  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken })
    }
  },
}

export default api
