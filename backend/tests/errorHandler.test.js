import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const clearRequireCache = () => {
  [
    '@sentry/node',
    '../src/config/sentry',
    '../src/config/env',
    '../src/middlewares/errorHandler',
  ].forEach(moduleId => {
    const resolved = require.resolve(moduleId);
    delete require.cache[resolved];
  });
};

const setupErrorHandler = () => {
  vi.resetModules();
  clearRequireCache();
  const sentryLib = require('@sentry/node');

  const captureSpy = vi.spyOn(sentryLib, 'captureException').mockImplementation(() => {});
  vi.spyOn(sentryLib, 'init').mockImplementation(() => {});
  vi.spyOn(sentryLib, 'expressIntegration').mockReturnValue('expressIntegration');
  vi.spyOn(sentryLib, 'expressErrorHandler').mockReturnValue('errorHandler');
  vi.spyOn(sentryLib, 'getIsolationScope').mockReturnValue({ setSDKProcessingMetadata: vi.fn() });
  vi.spyOn(sentryLib, 'setTag').mockImplementation(() => {});

  const sentryModule = require('../src/config/sentry');
  const { config } = require('../src/config/env');
  const { errorHandler } = require('../src/middlewares/errorHandler');

  return { errorHandler, config, sentryModule, captureSpy };
};

const createResponse = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  return res;
};

describe('errorHandler middleware', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    clearRequireCache();
  });

  it('formats validation errors with status 400 and skips Sentry', () => {
    const { errorHandler, captureSpy } = setupErrorHandler();
    const res = createResponse();
    const err = { type: 'validation', message: 'Invalid payload', details: ['age'] };

    errorHandler(err, {}, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ details: err.details }),
      })
    );
    expect(captureSpy).not.toHaveBeenCalled();
  });

  it('captures unexpected errors and returns status 500', () => {
    const { errorHandler, config, sentryModule, captureSpy } = setupErrorHandler();
    config.sentry.enabled = true;
    config.sentry.dsn = 'https://examplePublicKey@o0.ingest.sentry.io/0';
    sentryModule.initSentry();

    const res = createResponse();
    const err = new Error('Boom');

    errorHandler(err, {}, res, vi.fn());

    expect(captureSpy).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Erro interno do servidor.' } });
  });
});
