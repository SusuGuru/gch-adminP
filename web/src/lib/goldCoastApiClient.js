const BASE_URL = 'https://gold-coast-api-production.up.railway.app';
const TOKEN_KEY = 'gch_admin_token';
const REFRESH_TOKEN_KEY = 'gch_admin_refresh_token';

class GoldCoastApiClient {
  async request(endpoint, options = {}) {
    const token = sessionStorage.getItem(TOKEN_KEY);
    
    const headers = {
      ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token && !endpoint.includes('/auth/admin/login')) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && !endpoint.includes('/auth/')) {
        const refreshed = await this.handleTokenRefresh();
        if (refreshed) {
          headers['Authorization'] = `Bearer ${sessionStorage.getItem(TOKEN_KEY)}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${retryResponse.status}`);
          }
          
          return retryResponse.json();
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
          sessionStorage.removeItem(REFRESH_TOKEN_KEY);
          window.location.href = '/admin/login';
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async handleTokenRefresh() {
    try {
      const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) return false;

      const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (data.accessToken) {
        sessionStorage.setItem(TOKEN_KEY, data.accessToken);
        if (data.refreshToken) {
          sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  async loginAdmin(password) {
    const data = await this.request('/api/v1/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    
    if (data.accessToken) {
      sessionStorage.setItem(TOKEN_KEY, data.accessToken);
      if (data.refreshToken) {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }
    }
    
    return data;
  }

  // Products
  async getProducts() {
    return this.request('/api/v1/products');
  }

  async createProduct(productData) {
    return this.request('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId, productData) {
    return this.request(`/api/v1/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId) {
    return this.request(`/api/v1/products/${productId}`, {
      method: 'DELETE',
    });
  }

  async uploadProductImage(productId, file) {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.request(`/api/v1/products/${productId}/images`, {
      method: 'POST',
      body: formData,
    });
  }

  // Orders
  async getOrders() {
    return this.request('/api/v1/orders');
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/api/v1/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Promotions
  async getPromotions() {
    return this.request('/api/v1/promotions');
  }

  async createPromotion(promoData) {
    return this.request('/api/v1/promotions', {
      method: 'POST',
      body: JSON.stringify(promoData),
    });
  }

  async updatePromotion(promoId, promoData) {
    return this.request(`/api/v1/promotions/${promoId}`, {
      method: 'PUT',
      body: JSON.stringify(promoData),
    });
  }

  async deletePromotion(promoId) {
    return this.request(`/api/v1/promotions/${promoId}`, {
      method: 'DELETE',
    });
  }
}

const goldCoastApiClient = new GoldCoastApiClient();
export default goldCoastApiClient;