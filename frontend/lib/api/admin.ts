import { safeApiCall, ApiResponse } from '@/lib/api-utils';

/**
 * Admin API Client - provides secure methods for admin dashboard data fetching
 * All methods automatically include authentication headers
 */

type AdminApiResponse<T = unknown> = ApiResponse<T>;

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Create headers with authentication token
 */
function createAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

/**
 * Admin API client class
 */
export class AdminApiClient {
  /**
   * Generic method for making authenticated admin API calls
   */
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<AdminApiResponse<T>> {
    const response = await safeApiCall<AdminApiResponse<T>>(endpoint, {
      ...options,
      headers: {
        ...createAuthHeaders(),
        ...options.headers,
      },
    });

    // safeApiCall returns the parsed JSON response, so we return it directly
    return response as AdminApiResponse<T>;
  }

  // User Management
  async getUsers(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const queryString = searchParams.toString();
    const endpoint = `/api/admin/users${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  async getUserById(userId: string) {
    return this.makeRequest(`/api/admin/users/${userId}`);
  }

  async updateUserRole(userId: string, role: string) {
    return this.makeRequest(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  }

  // Package Management
  async getPackageDefinitions() {
    return this.makeRequest('/api/admin/package-definitions');
  }

  async createPackageDefinition(data: Record<string, unknown>) {
    return this.makeRequest('/api/admin/package-definitions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updatePackageDefinition(id: number, data: Record<string, unknown>) {
    return this.makeRequest(`/api/admin/package-definitions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deletePackageDefinition(id: number) {
    return this.makeRequest(`/api/admin/package-definitions/${id}`, {
      method: 'DELETE'
    });
  }

  // Booking Management
  async getBookings(params?: { page?: number; limit?: number; status?: string; dateFrom?: string; dateTo?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    
    const queryString = searchParams.toString();
    const endpoint = `/api/admin/bookings${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  async getBookingStats() {
    return this.makeRequest('/api/admin/bookings/stats');
  }

  async updateBookingStatus(bookingId: number, status: string) {
    return this.makeRequest(`/api/admin/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Dashboard Statistics
  async getDashboardStats() {
    return this.makeRequest('/api/admin/stats');
  }

  async getRevenueStats(params?: { period?: string; dateFrom?: string; dateTo?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set('period', params.period);
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    
    const queryString = searchParams.toString();
    const endpoint = `/api/admin/stats/revenue${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Content Management
  async getContent() {
    return this.makeRequest('/api/admin/content');
  }

  async updateContent(data: Record<string, unknown>) {
    return this.makeRequest('/api/admin/content', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Communication Management
  async getCommunicationConfig() {
    return this.makeRequest('/api/admin/communication/config');
  }

  async updateCommunicationConfig(data: Record<string, unknown>) {
    return this.makeRequest('/api/admin/communication/config', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async getCommunicationTemplates() {
    return this.makeRequest('/api/admin/communication/templates');
  }

  // Bug Reports
  async getBugReports(params?: { status?: string; priority?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.priority) searchParams.set('priority', params.priority);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const endpoint = `/api/admin/bug-reports${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  async updateBugReportStatus(bugId: string, status: string) {
    return this.makeRequest(`/api/admin/bug-reports/${bugId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async assignBugReport(bugId: string, assigneeId: string) {
    return this.makeRequest(`/api/admin/bug-reports/${bugId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ assigneeId })
    });
  }

  // System Health
  async getSystemHealth() {
    return this.makeRequest('/api/admin/health');
  }

  // External APIs
  async getExternalApiConfigs() {
    return this.makeRequest('/api/admin/external-apis');
  }

  async updateExternalApiConfig(configId: string, data: Record<string, unknown>) {
    return this.makeRequest(`/api/admin/external-apis/${configId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
}

// Export singleton instance
export const adminApi = new AdminApiClient();

// Export individual methods for convenience
export const {
  getUsers,
  getUserById,
  updateUserRole,
  getPackageDefinitions,
  createPackageDefinition,
  updatePackageDefinition,
  deletePackageDefinition,
  getBookings,
  getBookingStats,
  updateBookingStatus,
  getDashboardStats,
  getRevenueStats,
  getContent,
  updateContent,
  getCommunicationConfig,
  updateCommunicationConfig,
  getCommunicationTemplates,
  getBugReports,
  updateBugReportStatus,
  assignBugReport,
  getSystemHealth,
  getExternalApiConfigs,
  updateExternalApiConfig
} = adminApi;
