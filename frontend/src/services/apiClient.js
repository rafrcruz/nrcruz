import { config } from '../config/env';
import { buildBackendValidationError } from './validation';
import { logger } from './logger';

const buildUrl = path => {
  if (!path.startsWith('/')) {
    return `${config.api.baseUrl}/${path}`;
  }
  return `${config.api.baseUrl}${path}`;
};

const parseJsonSafely = text => {
  try {
    return JSON.parse(text);
  } catch (error) {
    logger.debug('Failed to parse JSON response for validation error', error);
    return null;
  }
};

const buildValidationErrorFromResponse = (response, path, errorText) => {
  if (response.status !== 400) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? parseJsonSafely(errorText) : null;

  if (!body) {
    return null;
  }

  const validationError = buildBackendValidationError(body);
  validationError.status = response.status;
  validationError.path = path;
  validationError.alreadyLogged = true;

  logger.warn('API validation error', {
    path,
    status: response.status,
    details: validationError.details,
  });

  return validationError;
};

// Backend validation responses (HTTP 400) are converted into ValidationError
// instances so components can react without changing the current UI flow.
const handleResponse = async (response, path) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    const validationError = buildValidationErrorFromResponse(response, path, errorText);
    if (validationError) {
      throw validationError;
    }

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
