import { config } from '../config/env';
import { logger } from './logger';

const buildUrl = path => {
  if (!path.startsWith('/')) {
    return `${config.api.baseUrl}/${path}`;
  }
  return `${config.api.baseUrl}${path}`;
};

const handleResponse = async (response, path) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    const message = errorText || `Request failed with status ${response.status}`;
    logger.error('API request failed', { path, status: response.status, message });
    throw new Error(message);
  }
  return response;
};

export const apiClient = {
  async get(path, options = {}) {
    try {
      const response = await fetch(buildUrl(path), {
        method: 'GET',
        ...options,
      });
      return handleResponse(response, path);
    } catch (error) {
      logger.error('Network error during API request', { path, error });
      throw error;
    }
  },
};
