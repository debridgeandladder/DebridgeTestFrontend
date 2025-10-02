import apiClient from './apiClient';
import endpoints from './endpoints';
import tokenService from './tokenService';

export const authService = {
  async login(email, password) {
    try {
      const { data } = await apiClient.post(endpoints.auth.login, {
        email,
        password
      });
      
      if (!data.token) {
        throw new Error('Invalid login response: missing token');
      }

      // Store tokens in session storage
      tokenService.setTokens(data.token, data.refreshToken || data.token);

      return { 
        success: true, 
        message: 'Login successful',
        user: data.user || { email, role: 'admin' }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await apiClient.post(endpoints.auth.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.clearTokens();
    }
  },

  async getProfile() {
    try {
      const { data } = await apiClient.get(endpoints.auth.profile);
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  isAuthenticated() {
    return tokenService.isAuthenticated();
  },

  getToken() {
    return tokenService.getAccessToken();
  }
};
