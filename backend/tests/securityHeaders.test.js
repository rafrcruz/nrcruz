import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const securityHeadersPath = require.resolve('../src/middlewares/securityHeaders.js');
const envPath = require.resolve('../src/config/env.js');
const helmetPath = require.resolve('helmet');

const originalEnv = { ...process.env };
let helmetMock;

const clearCaches = () => {
  delete require.cache[securityHeadersPath];
  delete require.cache[envPath];
  delete require.cache[helmetPath];
};

beforeEach(() => {
  vi.clearAllMocks();
  clearCaches();
  helmetMock = vi.fn(opts => ({ helmetOptions: opts }));
  require.cache[helmetPath] = { exports: helmetMock };
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = { ...originalEnv };
  clearCaches();
});

describe('securityHeaders middleware', () => {
  it('disables CSP when DISABLE_CSP is true', () => {
    process.env.DISABLE_CSP = 'true';
    process.env.NODE_ENV = 'development';

    const { securityHeaders } = require(securityHeadersPath);

    expect(helmetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        contentSecurityPolicy: false,
        hsts: false,
      })
    );
    expect(securityHeaders).toEqual(
      expect.objectContaining({
        helmetOptions: expect.objectContaining({ contentSecurityPolicy: false }),
      })
    );
  });

  it('enables HSTS in production by default', () => {
    process.env.DISABLE_CSP = '';
    process.env.NODE_ENV = 'production';
    process.env.HSTS_ENABLED = undefined;

    require(securityHeadersPath);

    const lastCall = helmetMock.mock.calls[0][0];
    expect(lastCall.hsts).toEqual(
      expect.objectContaining({
        maxAge: 60 * 60 * 24 * 180,
        includeSubDomains: true,
        preload: false,
      })
    );
    expect(lastCall.contentSecurityPolicy).toEqual(
      expect.objectContaining({
        directives: expect.objectContaining({ defaultSrc: ["'self'"] }),
      })
    );
  });
});
