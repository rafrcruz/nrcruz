import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const mockInit = vi.fn();
const mockExpressIntegration = vi.fn(() => 'expressIntegration');
const mockExpressErrorHandler = vi.fn(() => 'errorHandler');
const mockCaptureException = vi.fn();
const mockGetIsolationScope = vi.fn(() => ({
  setSDKProcessingMetadata: vi.fn(),
}));

vi.mock('@sentry/node', () => ({
  init: mockInit,
  expressIntegration: mockExpressIntegration,
  expressErrorHandler: mockExpressErrorHandler,
  captureException: mockCaptureException,
  getIsolationScope: mockGetIsolationScope,
}));

const loadSentry = () => {
  vi.resetModules();
  const sentryModule = require('../src/config/sentry');
  const config = require('../src/config/env').config;
  const { logger } = require('../src/utils/logger');

  return { sentryModule, config, logger };
};

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('sentry configuration', () => {
  it('returns null handlers before initialization', () => {
    const { sentryModule } = loadSentry();

    expect(sentryModule.getRequestHandler()).toBeNull();
    expect(sentryModule.getErrorHandler()).toBeNull();
  });

  it('skips initialization when sentry is disabled', () => {
    const { sentryModule, config } = loadSentry();
    config.sentry.enabled = false;

    sentryModule.initSentry();

    expect(mockInit).not.toHaveBeenCalled();
    expect(sentryModule.getRequestHandler()).toBeNull();
    expect(sentryModule.getErrorHandler()).toBeNull();
  });

  it('warns when enabled without DSN and does not initialize', () => {
    const { sentryModule, config, logger } = loadSentry();
    const warnSpy = vi.spyOn(logger, 'warn');
    config.sentry.enabled = true;
    config.sentry.dsn = '';

    sentryModule.initSentry();

    expect(warnSpy).toHaveBeenCalledWith('Sentry habilitado, mas nenhuma DSN foi fornecida.');
    expect(mockInit).not.toHaveBeenCalled();
    expect(sentryModule.getRequestHandler()).toBeNull();
    expect(sentryModule.getErrorHandler()).toBeNull();
  });
});
