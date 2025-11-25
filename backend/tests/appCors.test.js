import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const appPath = require.resolve('../src/app.js');
const envPath = require.resolve('../src/config/env.js');
const sentryPath = require.resolve('../src/config/sentry.js');
const routesPath = require.resolve('../src/routes/index.js');
const securityHeadersPath = require.resolve('../src/middlewares/securityHeaders.js');
const trafficControlPath = require.resolve('../src/middlewares/trafficControl.js');
const helmetPath = require.resolve('helmet');
const corsPath = require.resolve('cors');

let capturedCorsOptions;

vi.mock('../src/config/sentry', () => ({
  initSentry: vi.fn(),
  getRequestHandler: () => null,
  getErrorHandler: () => null,
}));

vi.mock('../src/middlewares/securityHeaders', () => ({
  securityHeaders: (_req, _res, next) => next(),
}));

vi.mock('../src/middlewares/trafficControl', () => ({
  rateLimiter: (_req, _res, next) => next(),
  userAgentFilter: (_req, _res, next) => next(),
}));

vi.mock('../src/routes', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/ping', (_req, res) => res.json({ ok: true }));
  return router;
});

const resetCaches = () => {
  [appPath, envPath, sentryPath, routesPath, securityHeadersPath, trafficControlPath].forEach(
    modPath => delete require.cache[modPath]
  );
  delete require.cache[helmetPath];
  delete require.cache[corsPath];
  capturedCorsOptions = undefined;
};

describe('app CORS configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCaches();
    const corsMock = vi.fn(options => {
      capturedCorsOptions = options;
      return (_req, _res, next) => next();
    });
    require.cache[corsPath] = { exports: corsMock };
    require.cache[sentryPath] = {
      exports: { initSentry: vi.fn(), getRequestHandler: () => null, getErrorHandler: () => null },
    };
    require.cache[helmetPath] = { exports: vi.fn(() => (_req, _res, next) => next()) };
  });

  it('allows requests with no origin when configured to do so', () => {
    const config = {
      env: 'test',
      cors: {
        allowedOrigins: [],
        allowCredentials: false,
        allowNoOrigin: true,
      },
    };
    require.cache[envPath] = { exports: { config } };

    require(appPath);

    const callback = vi.fn();
    capturedCorsOptions.origin(undefined, callback);
    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('accepts known origins and rejects unknown ones', () => {
    const config = {
      env: 'test',
      cors: {
        allowedOrigins: ['https://allowed.test'],
        allowCredentials: true,
        allowNoOrigin: false,
      },
    };
    require.cache[envPath] = { exports: { config } };

    require(appPath);

    const callback = vi.fn();
    capturedCorsOptions.origin('https://allowed.test', callback);
    expect(callback).toHaveBeenCalledWith(null, true);

    const callbackDenied = vi.fn();
    capturedCorsOptions.origin('https://blocked.test', callbackDenied);
    expect(callbackDenied).toHaveBeenCalledWith(null, false);
  });
});
