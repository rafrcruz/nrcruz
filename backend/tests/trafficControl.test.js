import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const request = require('supertest');

const reloadApp = () => {
  vi.resetModules();
  return require('../src/app').app;
};

beforeEach(() => {
  process.env.RATE_LIMIT_ENABLED = 'true';
  process.env.RATE_LIMIT_MAX_REQUESTS = '2';
  process.env.RATE_LIMIT_WINDOW_MS = '1000';
  process.env.RATE_LIMIT_SKIP_PATHS = '/health';
  process.env.BOT_FILTER_ENABLED = 'true';
});

afterEach(() => {
  delete process.env.RATE_LIMIT_ENABLED;
  delete process.env.RATE_LIMIT_MAX_REQUESTS;
  delete process.env.RATE_LIMIT_WINDOW_MS;
  delete process.env.RATE_LIMIT_SKIP_PATHS;
  delete process.env.BOT_FILTER_ENABLED;
});

describe('traffic controls', () => {
  it('enforces lightweight rate limits', async () => {
    const app = reloadApp();

    const agent = request.agent(app);
    await agent.get('/api/hello').set('User-Agent', 'vitest-agent');
    await agent.get('/api/hello').set('User-Agent', 'vitest-agent');
    const third = await agent.get('/api/hello').set('User-Agent', 'vitest-agent');

    expect(third.status).toBe(429);
    expect(third.body.error.message).toMatch(/Too many requests/i);
  });

  it('rejects empty user agents', async () => {
    const app = reloadApp();

    const response = await request(app).get('/api/hello').set('User-Agent', '');

    expect(response.status).toBe(400);
    expect(response.body.error.message).toMatch(/User-Agent header is required/);
  });
});
