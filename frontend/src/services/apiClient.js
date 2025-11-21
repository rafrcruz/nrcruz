import { config } from '../config/env';

const buildUrl = path => {
  if (!path.startsWith('/')) {
    return `${config.api.baseUrl}/${path}`;
  }
  return `${config.api.baseUrl}${path}`;
};

const handleResponse = async response => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    const message = errorText || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return response;
};

export const apiClient = {
  async get(path, options = {}) {
    const response = await fetch(buildUrl(path), {
      method: 'GET',
      ...options,
    });
    return handleResponse(response);
  },
};
