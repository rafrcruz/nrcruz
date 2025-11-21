import { describe, it, expect, vi } from 'vitest';
import { createRequire } from 'node:module';
import { getHello } from '../src/controllers/helloController.js';

const require = createRequire(import.meta.url);

describe('helloController.getHello', () => {
  it('responds with the hello message', () => {
    const res = { send: vi.fn() };
    const next = vi.fn();

    getHello({}, res, next);

    expect(res.send).toHaveBeenCalledWith('NRCruz app');
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards errors to the next handler when service fails', () => {
    const res = { send: vi.fn() };
    const next = vi.fn();
    const helloService = require('../src/services/helloService');

    const original = helloService.getHelloMessage;
    helloService.getHelloMessage = vi.fn(() => {
      throw new Error('Service failure');
    });

    getHello({}, res, next);

    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);

    helloService.getHelloMessage = original;
  });
});
