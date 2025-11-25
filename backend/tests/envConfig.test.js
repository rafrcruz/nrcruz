import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const envPath = require.resolve('../src/config/env.js');

const originalEnv = { ...process.env };

const resetModule = () => {
  delete require.cache[envPath];
};

beforeEach(() => {
  resetModule();
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = { ...originalEnv };
  resetModule();
});

describe('env config parsing', () => {
  it('falls back to defaults when env variables are missing or invalid', () => {
    process.env.PORT = 'not-a-number';
    process.env.CORS_ALLOWED_ORIGINS = '';
    process.env.CORS_ALLOW_NO_ORIGIN = undefined;
    process.env.RATE_LIMIT_ENABLED = undefined;
    process.env.RATE_LIMIT_SKIP_PATHS = undefined;

    const { config } = require(envPath);

    expect(config.server.port).toBe(3001);
    expect(config.cors.allowedOrigins).toContain('http://localhost:3000');
    expect(config.cors.allowNoOrigin).toBe(true);
    expect(config.traffic.rateLimit.enabled).toBe(true);
    expect(config.traffic.rateLimit.skipPaths).toEqual(['/health']);
  });

  it('respects explicit overrides for CORS and rate limiting', () => {
    process.env.CORS_ALLOWED_ORIGINS = 'https://example.com, https://other.com';
    process.env.CORS_ALLOW_NO_ORIGIN = 'false';
    process.env.RATE_LIMIT_SKIP_PATHS = '/status , /metrics';
    process.env.RATE_LIMIT_ENABLED = 'false';
    process.env.RATE_LIMIT_MAX_REQUESTS = '200';

    const { config } = require(envPath);

    expect(config.cors.allowedOrigins).toEqual(['https://example.com', 'https://other.com']);
    expect(config.cors.allowNoOrigin).toBe(false);
    expect(config.traffic.rateLimit.enabled).toBe(false);
    expect(config.traffic.rateLimit.maxRequests).toBe(200);
    expect(config.traffic.rateLimit.skipPaths).toEqual(['/status', '/metrics']);
  });
});
