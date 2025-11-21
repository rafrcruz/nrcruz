import { registerGlobalErrorHandlers } from './globalErrorHandler';
import { logger } from './logger';
import { captureWithSentry, isSentryReady } from './sentry';

vi.mock('./logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('./sentry', () => ({
  captureWithSentry: vi.fn(),
  isSentryReady: vi.fn(() => ({ enabled: true, initialized: true })),
}));

const originalWindow = globalThis.window;
const originalOnError = globalThis.onerror;
const originalOnUnhandledRejection = globalThis.onunhandledrejection;

describe('registerGlobalErrorHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.window = originalWindow;
    globalThis.onerror = undefined;
    globalThis.onunhandledrejection = undefined;
    isSentryReady.mockReturnValue({ enabled: true, initialized: true });
  });

  afterAll(() => {
    globalThis.window = originalWindow;
    globalThis.onerror = originalOnError;
    globalThis.onunhandledrejection = originalOnUnhandledRejection;
  });

  it('skips registration when window is unavailable', () => {
    globalThis.window = undefined;
    registerGlobalErrorHandlers();
    expect(globalThis.onerror).toBeUndefined();
    expect(globalThis.onunhandledrejection).toBeUndefined();
  });

  it('handles global errors and reports them', () => {
    registerGlobalErrorHandlers();
    const error = new Error('boom');

    globalThis.onerror?.('Message', 'source.js', 10, 20, error);

    expect(logger.error).toHaveBeenCalledWith('Unhandled error captured globally', {
      source: 'source.js',
      line: 10,
      column: 20,
      error,
    });
    expect(captureWithSentry).toHaveBeenCalledWith(error, {
      extra: { source: 'source.js', line: 10, column: 20 },
    });
  });

  it('calls any previous error handlers', () => {
    const previous = vi.fn().mockReturnValue('handled');
    globalThis.onerror = previous;

    registerGlobalErrorHandlers();
    const result = globalThis.onerror?.('msg', 'src.js', 1, 2, new Error('fail'));

    expect(previous).toHaveBeenCalled();
    expect(result).toBe('handled');
  });

  it('handles unhandled rejections and serializes reasons', () => {
    registerGlobalErrorHandlers();
    const reason = { foo: 'bar' };

    globalThis.onunhandledrejection?.({ reason });

    expect(logger.error).toHaveBeenCalledWith('Unhandled promise rejection captured globally', {
      reason: { foo: 'bar' },
    });
    expect(captureWithSentry).toHaveBeenCalledWith(expect.any(Error), {
      extra: { reason: { foo: 'bar' } },
    });
  });

  it('does not report to Sentry when it is not ready', () => {
    isSentryReady.mockReturnValueOnce({ enabled: false, initialized: false });
    registerGlobalErrorHandlers();

    globalThis.onerror?.('msg', 'src.js', 1, 1, new Error('fail'));

    expect(captureWithSentry).not.toHaveBeenCalled();
  });
});
