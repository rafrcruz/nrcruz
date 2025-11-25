import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from './apiClient';
import { ValidationError } from './validation';
import { logger } from './logger';

vi.mock('../config/env', () => ({
  config: { api: { baseUrl: 'http://localhost' } },
}));

vi.mock('./logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

const originalFetch = global.fetch;

afterEach(() => {
  vi.clearAllMocks();
  global.fetch = originalFetch;
});

describe('apiClient', () => {
  it('returns the response when the request is successful', async () => {
    const mockResponse = new Response('ok', { status: 200 });
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const response = await apiClient.get('/test');

    expect(response).toBe(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost/test', {
      method: 'GET',
    });
  });

  it('throws a ValidationError when the API returns validation details', async () => {
    const mockResponse = new Response(
      JSON.stringify({ message: 'Invalid', errors: { name: ['Required'] } }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await expect(apiClient.get('/users')).rejects.toBeInstanceOf(ValidationError);
    expect(logger.warn).toHaveBeenCalled();
  });

  it('falls back to a generic error for non-validation failures', async () => {
    const mockResponse = new Response('Server exploded', { status: 500 });
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await expect(apiClient.get('/boom')).rejects.toThrow('Server exploded');
    expect(logger.error).toHaveBeenCalledWith('API request failed', {
      path: '/boom',
      status: 500,
      message: 'Server exploded',
    });
  });
});
