import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const helloService = require('../src/modules/hello/hello.service');
const { getHello } = require('../src/modules/hello/hello.controller');

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('helloController', () => {
  it('sends hello message response', () => {
    vi.spyOn(helloService, 'getHelloMessage').mockReturnValue('NRCruz app');
    const send = vi.fn();
    const next = vi.fn();

    getHello({}, { send }, next);

    expect(send).toHaveBeenCalledWith('NRCruz app');
    expect(next).not.toHaveBeenCalled();
  });

  it('delegates errors to the error handler', () => {
    const error = new Error('Unexpected');
    vi.spyOn(helloService, 'getHelloMessage').mockImplementation(() => {
      throw error;
    });
    const send = vi.fn();
    const next = vi.fn();

    getHello({}, { send }, next);

    expect(send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
