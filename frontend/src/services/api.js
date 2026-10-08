import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof process !== 'undefined' && process.env?.BACKEND_URL) ||
  '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  /**
   * Health check endpoint
   */
  async checkHealth() {
    try {
      const response = await apiClient.get('/api/health');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Health check failed',
      };
    }
  },

  /**
   * Retrieve complete catalog of supported hand signs
   */
  async getSignCatalog() {
    try {
      const response = await apiClient.get('/api/signs');
      return { success: true, data: response.data.signs };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to fetch signs',
      };
    }
  },

  /**
   * REST fallback for single frame detection
   */
  async detectFrame(base64Image) {
    try {
      const response = await apiClient.post('/api/detect', {
        image: base64Image,
        timestamp: Date.now(),
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Detection failed',
      };
    }
  },
};

export default apiService;
