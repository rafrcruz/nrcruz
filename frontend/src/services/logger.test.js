import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logger } from './logger';
import { captureExceptionFromLogger } from './sentry';

vi.mock('./sentry', () => ({
  captureExceptionFromLogger: vi.fn(),
}));

describe('logger', () => {
  const fixedDate = new Date('2024-01-01T00:00:00.000Z');
  const originalDate = Date;

  beforeEach(() => {
    vi.clearAllMocks();
    class MockDate extends Date {
      constructor(...args) {
        super(...(args.length ? args : [fixedDate]));
      }
      static now() {
        return fixedDate.getTime();
      }
    }

    MockDate.parse = originalDate.parse;
    MockDate.UTC = originalDate.UTC;
    global.Date = MockDate;

    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    global.Date = originalDate;
    vi.restoreAllMocks();
  });

  it('logs info, warn and debug messages with formatted prefixes', () => {
    logger.info('info message', { a: 1 });
    logger.warn('warn message');
    logger.debug('debug message', 'extra');

    expect(console.info).toHaveBeenCalledWith('[2024-01-01T00:00:00.000Z] [INFO] info message', {
      a: 1,
    });
    expect(console.warn).toHaveBeenCalledWith('[2024-01-01T00:00:00.000Z] [WARN] warn message');
    expect(console.debug).toHaveBeenCalledWith(
      '[2024-01-01T00:00:00.000Z] [DEBUG] debug message',
      'extra'
    );
  });

  it('captures exceptions when logging errors', () => {
    logger.error('boom', new Error('oops'));

    expect(console.error).toHaveBeenCalledWith(
      '[2024-01-01T00:00:00.000Z] [ERROR] boom',
      expect.any(Error)
    );
    expect(captureExceptionFromLogger).toHaveBeenCalledWith('boom', [expect.any(Error)]);
  });
});
