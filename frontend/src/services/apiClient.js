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
    const error = new Error(message);
    error.status = response.status;
    error.path = path;
    error.alreadyLogged = true;
    logger.error('API request failed', { path, status: response.status, message });
    throw error;
  }
  return response;
};

const logAndThrowUnexpected = (path, error) => {
  const errorToThrow = error instanceof Error ? error : new Error('Unexpected API error');

  if (errorToThrow.alreadyLogged) {
    throw errorToThrow;
  }

  logger.error('Unexpected error during API request', { path, error: errorToThrow });
  throw errorToThrow;
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
      logAndThrowUnexpected(path, error);
    }
  },
};
