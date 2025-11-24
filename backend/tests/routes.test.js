import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const request = require('supertest');
const helloService = require('../src/modules/hello/hello.service');
const { config } = require('../src/config/env');
const { version } = require('../package.json');
const { app } = require('../src/app');

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('GET /api/hello', () => {
  it('returns the hello message', async () => {
    vi.spyOn(helloService, 'getHelloMessage').mockReturnValue('NRCruz app');

    const response = await request(app).get('/api/hello').set('User-Agent', 'vitest');

    expect(response.status).toBe(200);
    expect(response.text).toBe('NRCruz app');
  });

  it('returns 500 when service throws', async () => {
    vi.spyOn(helloService, 'getHelloMessage').mockImplementation(() => {
      throw new Error('Boom');
    });

    const response = await request(app).get('/api/hello').set('User-Agent', 'vitest');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: { message: 'Erro interno do servidor.' } });
  });
});

describe('GET /health', () => {
  it('returns service health details without dependencies', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', env: config.env, version });
  });
});

describe('CORS configuration', () => {
  it('allows whitelisted origins', async () => {
    const response = await request(app).get('/health').set('Origin', 'http://localhost:3000');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it('denies CORS for unknown origins', async () => {
    const response = await request(app).get('/health').set('Origin', 'http://malicious.test');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});
