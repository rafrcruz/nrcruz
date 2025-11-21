import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../src/services/apiClient';
import { config } from '../src/config/env';

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('apiClient.get', () => {
  it('builds the URL with base path and returns the response on success', async () => {
    config.api.baseUrl = 'http://example.com';
    const text = vi.fn().mockResolvedValue('ok');
    global.fetch.mockResolvedValue({ ok: true, text });

    const response = await apiClient.get('/api/hello');

    expect(global.fetch).toHaveBeenCalledWith('http://example.com/api/hello', {
      method: 'GET',
    });
    expect(response.text).toBe(text);
  });

  it('throws an error when the response is not ok', async () => {
    config.api.baseUrl = 'http://example.com';
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue('boom'),
    });

    await expect(apiClient.get('endpoint')).rejects.toThrow('boom');
    expect(global.fetch).toHaveBeenCalledWith('http://example.com/endpoint', {
      method: 'GET',
    });
  });
});
