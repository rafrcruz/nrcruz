import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const helloService = require('../src/modules/hello/hello.service');
const { getHello } = require('../src/modules/hello/hello.controller');

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('helloController', () => {
  it('sends hello message response', async () => {
    vi.spyOn(helloService, 'getHelloMessage').mockResolvedValue('NRCruz app');
    const send = vi.fn();
    const next = vi.fn();

    await getHello({}, { send }, next);

    expect(send).toHaveBeenCalledWith('NRCruz app');
    expect(next).not.toHaveBeenCalled();
  });

  it('propagates errors to Express (promise rejection)', async () => {
    const error = new Error('Unexpected');
    vi.spyOn(helloService, 'getHelloMessage').mockRejectedValue(error);
    const send = vi.fn();
    const next = vi.fn();

    await expect(getHello({}, { send }, next)).rejects.toThrow(error);

    expect(send).not.toHaveBeenCalled();
    // Express 5 encaminha rejeições de Promise automaticamente para o error handler,
    // então o controller não precisa chamar next manualmente.
    expect(next).not.toHaveBeenCalled();
  });
});
