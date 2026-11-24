// ============================================
// js/api.js
// API helper - handles all backend communication
// ============================================

// Base URL of your backend server
const API_BASE = 'http://localhost:5000/api';

// ---- Get stored JWT token from localStorage ----
const getToken = () => localStorage.getItem('sf_token');

// ---- Get current user info ----
const getCurrentUser = () => {
  const user = localStorage.getItem('sf_user');
  return user ? JSON.parse(user) : null;
};

// ---- Save user info after login ----
const saveAuth = (token, user) => {
  localStorage.setItem('sf_token', token);
  localStorage.setItem('sf_user', JSON.stringify(user));
};

// ---- Clear auth on logout ----
const clearAuth = () => {
  localStorage.removeItem('sf_token');
  localStorage.removeItem('sf_user');
};

// ---- Main API request function ----
// This handles all HTTP requests to the backend
const apiRequest = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  const headers = {};

  // Add token if logged in
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Add Content-Type for JSON (not for FormData - browser sets it automatically)
  if (!isFormData && body) headers['Content-Type'] = 'application/json';

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong. Please try again.');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// AUTH API CALLS
// ============================================
const authAPI = {
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
  googleLogin: (data) => apiRequest('/auth/google', 'POST', data),
  getProfile: () => apiRequest('/auth/profile'),
  updateProfile: (data) => apiRequest('/auth/profile', 'PUT', data),
};

// ============================================
// PROPERTY API CALLS
// ============================================
const propertyAPI = {
  // Get all approved properties with optional filters
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/properties?${query}`);
  },
  // Get a single property by ID
  getOne: (id) => apiRequest(`/properties/${id}`),
  // Create new property (owner only) - uses FormData for image uploads
  create: (formData) => apiRequest('/properties', 'POST', formData, true),
  // Update property (owner only)
  update: (id, formData) => apiRequest(`/properties/${id}`, 'PUT', formData, true),
  // Delete property
  delete: (id) => apiRequest(`/properties/${id}`, 'DELETE'),
  // Get owner's own listings
  getMyListings: () => apiRequest('/properties/my-listings'),
  // Toggle available/unavailable
  toggleAvailability: (id) => apiRequest(`/properties/${id}/availability`, 'PATCH'),
};

// ============================================
// ENQUIRY API CALLS
// ============================================
const enquiryAPI = {
  submit: (data) => apiRequest('/enquiries', 'POST', data),
  getMyEnquiries: () => apiRequest('/enquiries/my-enquiries'),
  getOwnerEnquiries: () => apiRequest('/enquiries/owner-enquiries'),
  updateStatus: (id, status, ownerReply = '') => apiRequest(`/enquiries/${id}/status`, 'PATCH', { status, ownerReply }),
};

// ============================================
// FAVOURITE API CALLS
// ============================================
const favouriteAPI = {
  getAll: () => apiRequest('/favourites'),
  add: (propertyId) => apiRequest('/favourites', 'POST', { propertyId }),
  remove: (propertyId) => apiRequest(`/favourites/${propertyId}`, 'DELETE'),
};

// ============================================
// ADMIN API CALLS
// ============================================
const adminAPI = {
  getStats: () => apiRequest('/admin/stats'),
  getAllProperties: (status) => apiRequest(`/admin/properties${status ? '?status=' + status : ''}`),
  approveProperty: (id) => apiRequest(`/admin/properties/${id}/approve`, 'PATCH'),
  rejectProperty: (id) => apiRequest(`/admin/properties/${id}/reject`, 'PATCH'),
  getAllUsers: (role) => apiRequest(`/admin/users${role ? '?role=' + role : ''}`),
  toggleUserStatus: (id) => apiRequest(`/admin/users/${id}/toggle-status`, 'PATCH'),
};
