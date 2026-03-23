/**
 * BizPilot AI - API Service
 * Backend API integration layer
 */

const BASE_URL = 'https://api.bizpilot.ai/v1'; // Replace with your actual API

class ApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async socialLogin(provider, token) {
    return this.request('/auth/social', {
      method: 'POST',
      body: JSON.stringify({ provider, token }),
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getRevenueData(period = '7d') {
    return this.request(`/dashboard/revenue?period=${period}`);
  }

  async getRecentActivity(limit = 10) {
    return this.request(`/dashboard/activity?limit=${limit}`);
  }

  // Analytics endpoints
  async getAnalytics(period = '30d') {
    return this.request(`/analytics?period=${period}`);
  }

  async getMetrics() {
    return this.request('/analytics/metrics');
  }

  async getTopProducts(limit = 5) {
    return this.request(`/analytics/products?limit=${limit}`);
  }

  async getCustomerSegments() {
    return this.request('/analytics/segments');
  }

  // AI Assistant endpoints
  async sendMessage(message, conversationId = null) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    });
  }

  async getConversations() {
    return this.request('/ai/conversations');
  }

  async generateReport(type, params = {}) {
    return this.request('/ai/report', {
      method: 'POST',
      body: JSON.stringify({ type, ...params }),
    });
  }

  // Project endpoints
  async getProjects(filter = 'all') {
    return this.request(`/projects?filter=${filter}`);
  }

  async createProject(data) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id, data) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // User / Settings endpoints
  async getProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(data) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateSettings(settings) {
    return this.request('/user/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getTeamMembers() {
    return this.request('/user/team');
  }
}

export default new ApiService();
