import React from 'react';
import { render, screen } from '@testing-library/react';

const initMock = vi.fn();
const captureExceptionMock = vi.fn();
const captureMessageMock = vi.fn();
const browserTracingIntegrationMock = vi.fn(() => 'trace');
const ErrorBoundary = ({ children }) => <div data-testid="sentry-boundary">{children}</div>;

vi.mock('@sentry/react', () => ({
  init: initMock,
  captureException: captureExceptionMock,
  captureMessage: captureMessageMock,
  browserTracingIntegration: browserTracingIntegrationMock,
  ErrorBoundary,
}));

const loadSentryModule = async config => {
  vi.resetModules();
  vi.doMock('../config/env', () => ({ config }), { cache: false });
  return import('./sentry.jsx');
};

const baseConfig = {
  env: 'test',
  api: { baseUrl: 'http://localhost:3001' },
  sentry: { enabled: true, dsn: 'dsn-token' },
};

describe('sentry service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes Sentry only once when enabled', async () => {
    const sentryModule = await loadSentryModule(baseConfig);

    sentryModule.initSentry();
    sentryModule.initSentry();

    expect(initMock).toHaveBeenCalledTimes(1);
    expect(initMock).toHaveBeenCalledWith({
      dsn: 'dsn-token',
      environment: 'test',
      integrations: ['trace'],
      tracesSampleRate: 1.0,
    });
    expect(sentryModule.isSentryReady()).toEqual({ enabled: true, initialized: true });
  });

  it('skips initialization and wraps children directly when disabled', async () => {
    const sentryModule = await loadSentryModule({
      ...baseConfig,
      sentry: { enabled: false, dsn: '' },
    });

    sentryModule.initSentry();
    expect(initMock).not.toHaveBeenCalled();
    expect(sentryModule.isSentryReady()).toEqual({ enabled: false, initialized: false });

    const { queryByTestId, getByText } = render(
      <sentryModule.SentryErrorBoundary>
        <span>Child</span>
      </sentryModule.SentryErrorBoundary>,
    );

    expect(getByText('Child')).toBeInTheDocument();
    expect(queryByTestId('sentry-boundary')).toBeNull();
  });

  it('captures exceptions and messages after initialization', async () => {
    const sentryModule = await loadSentryModule(baseConfig);
    sentryModule.initSentry();

    const error = new Error('fail');
    sentryModule.captureWithSentry(error, { extra: { a: 1 } });
    sentryModule.captureWithSentry('oops', { extra: { b: 2 } });

    expect(captureExceptionMock).toHaveBeenCalledWith(error, { extra: { a: 1 } });
    expect(captureMessageMock).toHaveBeenCalledWith('oops', { level: 'error', extra: { b: 2 } });
  });

  it('captures logger errors and messages appropriately', async () => {
    const sentryModule = await loadSentryModule(baseConfig);
    sentryModule.initSentry();

    const error = new Error('broken');
    sentryModule.captureExceptionFromLogger('log message', [error, 'more']);
    sentryModule.captureExceptionFromLogger('just text', ['context']);

    expect(captureExceptionMock).toHaveBeenCalledWith(error, {
      level: 'error',
      extra: { message: 'log message', params: ['more'] },
    });
    expect(captureMessageMock).toHaveBeenCalledWith('just text', {
      level: 'error',
      extra: { params: ['context'] },
    });
  });

  it('wraps children with the Sentry error boundary when enabled', async () => {
    const sentryModule = await loadSentryModule(baseConfig);
    const { getByTestId, getByText } = render(
      <sentryModule.SentryErrorBoundary>
        <span>Wrapped</span>
      </sentryModule.SentryErrorBoundary>,
    );

    expect(getByTestId('sentry-boundary')).toBeInTheDocument();
    expect(getByText('Wrapped')).toBeInTheDocument();
  });
});
