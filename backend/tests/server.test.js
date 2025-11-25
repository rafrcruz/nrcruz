import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serverPath = require.resolve('../src/server.js');
const appPath = require.resolve('../src/app.js');
const loggerPath = require.resolve('../src/utils/logger.js');
const envPath = require.resolve('../src/config/env.js');

const originalNodeEnv = process.env.NODE_ENV;

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  delete require.cache[serverPath];
  delete require.cache[appPath];
  delete require.cache[loggerPath];
  delete require.cache[envPath];
  process.env.NODE_ENV = 'test';
});

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
});

describe('server bootstrap', () => {
  it('starts the express app using configured port', () => {
    const listenMock = vi.fn((_port, cb) => cb && cb());
    const infoMock = vi.fn();

    require.cache[appPath] = { exports: { app: { listen: listenMock } } };
    require.cache[loggerPath] = { exports: { logger: { info: infoMock } } };
    require.cache[envPath] = { exports: { config: { server: { port: 5050 }, env: 'test' } } };

    const { startServer } = require(serverPath);
    startServer();

    expect(listenMock).toHaveBeenCalledWith(5050, expect.any(Function));
    expect(infoMock).toHaveBeenCalledWith(
      'Backend iniciado em http://localhost:5050 (ambiente: test)'
    );
  });
});
