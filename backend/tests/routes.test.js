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

    const response = await request(app).get('/api/hello');

    expect(response.status).toBe(200);
    expect(response.text).toBe('NRCruz app');
  });

  it('returns 500 when service throws', async () => {
    vi.spyOn(helloService, 'getHelloMessage').mockImplementation(() => {
      throw new Error('Boom');
    });

    const response = await request(app).get('/api/hello');

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
