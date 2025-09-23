const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }
  
  const data = await response.json();
  return data.data || data;
}

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // Projects API
  static async getProjects(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return this.request(`/api/projects${queryString ? `?${queryString}` : ''}`);
  }

  static async getProject(id: string) {
    return this.request(`/api/projects/${id}`);
  }

  static async createProject(data: any) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateProject(id: string, data: any) {
    return this.request(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteProject(id: string) {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  static async getProjectStats() {
    return this.request('/api/projects/stats/overview');
  }

  // Notes API
  static async getImportantNotes() {
    return this.request('/api/notes/important');
  }

  static async createImportantNote(data: { content: string }) {
    return this.request('/api/notes/important', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateImportantNote(id: string, data: { content: string }) {
    return this.request(`/api/notes/important/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteImportantNote(id: string) {
    return this.request(`/api/notes/important/${id}`, {
      method: 'DELETE',
    });
  }

  static async getDailyTasks(date?: string) {
    const queryString = date ? `?date=${date}` : '';
    return this.request(`/api/notes/daily-tasks${queryString}`);
  }

  static async createDailyTask(data: { content: string; date: string }) {
    return this.request('/api/notes/daily-tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateDailyTask(id: string, data: { content: string; date: string }) {
    return this.request(`/api/notes/daily-tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteDailyTask(id: string) {
    return this.request(`/api/notes/daily-tasks/${id}`, {
      method: 'DELETE',
    });
  }

  static async toggleDailyTaskComplete(id: string, completed: boolean) {
    return this.request(`/api/notes/daily-tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  }

  static async getGeneralNotes() {
    return this.request('/api/notes/general');
  }

  static async createGeneralNote(data: { content: string }) {
    return this.request('/api/notes/general', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateGeneralNote(id: string, data: { content: string }) {
    return this.request(`/api/notes/general/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteGeneralNote(id: string) {
    return this.request(`/api/notes/general/${id}`, {
      method: 'DELETE',
    });
  }

  // Subscriptions API
  static async getSubscriptions(params?: {
    search?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    
    const queryString = searchParams.toString();
    return this.request(`/api/subscriptions${queryString ? `?${queryString}` : ''}`);
  }

  static async getSubscription(id: string) {
    return this.request(`/api/subscriptions/${id}`);
  }

  static async createSubscription(data: { name: string; price: number; date: string }) {
    return this.request('/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateSubscription(id: string, data: { name: string; price: number; date: string }) {
    return this.request(`/api/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteSubscription(id: string) {
    return this.request(`/api/subscriptions/${id}`, {
      method: 'DELETE',
    });
  }

  static async getSubscriptionStats(startDate?: string, endDate?: string) {
    const searchParams = new URLSearchParams();
    if (startDate) searchParams.append('startDate', startDate);
    if (endDate) searchParams.append('endDate', endDate);
    
    const queryString = searchParams.toString();
    return this.request(`/api/subscriptions/stats/total${queryString ? `?${queryString}` : ''}`);
  }

  // TikTok Ads API
  static async getTikTokAds(params?: {
    search?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    
    const queryString = searchParams.toString();
    return this.request(`/api/tiktok-ads${queryString ? `?${queryString}` : ''}`);
  }

  static async getTikTokAd(id: string) {
    return this.request(`/api/tiktok-ads/${id}`);
  }

  static async createTikTokAd(data: { name: string; price: number; date: string }) {
    return this.request('/api/tiktok-ads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateTikTokAd(id: string, data: { name: string; price: number; date: string }) {
    return this.request(`/api/tiktok-ads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteTikTokAd(id: string) {
    return this.request(`/api/tiktok-ads/${id}`, {
      method: 'DELETE',
    });
  }

  static async getTikTokAdStats(startDate?: string, endDate?: string) {
    const searchParams = new URLSearchParams();
    if (startDate) searchParams.append('startDate', startDate);
    if (endDate) searchParams.append('endDate', endDate);
    
    const queryString = searchParams.toString();
    return this.request(`/api/tiktok-ads/stats/total${queryString ? `?${queryString}` : ''}`);
  }
}

export { ApiError };
export default ApiService;
