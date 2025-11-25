import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const clearRequireCache = () => {
  ['@sentry/node', '../src/config/sentry', '../src/config/env', '../src/utils/logger'].forEach(
    moduleId => {
      const resolved = require.resolve(moduleId);
      delete require.cache[resolved];
    }
  );
};

const setupSentrySpies = () => {
  const sentryLib = require('@sentry/node');

  const initSpy = vi.spyOn(sentryLib, 'init').mockImplementation(() => {});
  const expressIntegrationSpy = vi
    .spyOn(sentryLib, 'expressIntegration')
    .mockReturnValue('expressIntegration');
  const expressErrorHandlerSpy = vi
    .spyOn(sentryLib, 'expressErrorHandler')
    .mockReturnValue('errorHandler');
  const captureExceptionSpy = vi.spyOn(sentryLib, 'captureException').mockImplementation(() => {});
  const getIsolationScopeSpy = vi.spyOn(sentryLib, 'getIsolationScope').mockReturnValue({
    setSDKProcessingMetadata: vi.fn(),
  });
  const setTagSpy = vi.spyOn(sentryLib, 'setTag').mockImplementation(() => {});

  return {
    sentryLib,
    spies: {
      initSpy,
      expressIntegrationSpy,
      expressErrorHandlerSpy,
      captureExceptionSpy,
      getIsolationScopeSpy,
      setTagSpy,
    },
  };
};

const loadSentry = () => {
  vi.resetModules();
  clearRequireCache();
  const { spies } = setupSentrySpies();
  const sentryModule = require('../src/config/sentry');
  const config = require('../src/config/env').config;
  const { logger } = require('../src/utils/logger');

  return { sentryModule, config, logger, spies };
};

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  clearRequireCache();
});

describe('sentry configuration', () => {
  it('returns null handlers before initialization', () => {
    const { sentryModule, spies } = loadSentry();

    expect(sentryModule.getRequestHandler()).toBeNull();
    expect(sentryModule.getErrorHandler()).toBeNull();
    expect(spies.initSpy).not.toHaveBeenCalled();
  });

  it('skips initialization when sentry is disabled', () => {
    const { sentryModule, config, spies } = loadSentry();
    config.sentry.enabled = false;

    sentryModule.initSentry();

    expect(spies.initSpy).not.toHaveBeenCalled();
    expect(sentryModule.getRequestHandler()).toBeNull();
    expect(sentryModule.getErrorHandler()).toBeNull();
  });

  it('warns when enabled without DSN and does not initialize', () => {
    const { sentryModule, config, logger, spies } = loadSentry();
    const warnSpy = vi.spyOn(logger, 'warn');
    config.sentry.enabled = true;
    config.sentry.dsn = '';

    sentryModule.initSentry();

    expect(warnSpy).toHaveBeenCalledWith('Sentry habilitado, mas nenhuma DSN foi fornecida.');
    expect(spies.initSpy).not.toHaveBeenCalled();
    expect(sentryModule.getRequestHandler()).toBeNull();
    expect(sentryModule.getErrorHandler()).toBeNull();
  });

  it('initializes sentry when enabled with DSN and exposes handlers', () => {
    const { sentryModule, config, spies } = loadSentry();
    config.sentry.enabled = true;
    config.sentry.dsn = 'https://examplePublicKey@o0.ingest.sentry.io/0';
    config.sentry.tracesSampleRate = 0.5;

    const app = { name: 'express-app' };

    sentryModule.initSentry(app);

    expect(spies.initSpy).toHaveBeenCalledTimes(1);
    const initOptions = spies.initSpy.mock.calls[0][0];
    expect(initOptions.dsn).toBe(config.sentry.dsn);
    expect(initOptions.tracesSampleRate).toBe(0.5);

    const integrations = initOptions.integrations(['baseIntegration']);
    expect(spies.expressIntegrationSpy).toHaveBeenCalledWith({ app });
    expect(integrations).toContain('expressIntegration');
    expect(integrations).toContain('baseIntegration');
    expect(spies.setTagSpy).toHaveBeenCalledWith('service.name', 'nrcruz-backend');

    const requestHandler = sentryModule.getRequestHandler();
    const next = vi.fn();
    requestHandler({ id: 'req-1' }, {}, next);
    expect(spies.getIsolationScopeSpy).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();

    expect(sentryModule.getErrorHandler()).toBe('errorHandler');
  });

  it('captures exceptions only after initialization', () => {
    const { sentryModule, config, spies } = loadSentry();
    const unexpectedError = new Error('unexpected');
    sentryModule.captureException(unexpectedError);
    expect(spies.captureExceptionSpy).not.toHaveBeenCalled();

    config.sentry.enabled = true;
    config.sentry.dsn = 'https://examplePublicKey@o0.ingest.sentry.io/0';

    sentryModule.initSentry();
    const runtimeError = new Error('runtime');
    sentryModule.captureException(runtimeError);
    expect(spies.captureExceptionSpy).toHaveBeenCalledWith(runtimeError);
  });
});
