import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const helloRepository = require('../src/repositories/helloRepository');
const helloService = require('../src/services/helloService');

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('helloService', () => {
  it('returns message from repository', () => {
    const fetchHelloMessageSpy = vi
      .spyOn(helloRepository, 'fetchHelloMessage')
      .mockReturnValue('NRCruz app');

    const message = helloService.getHelloMessage();

    expect(fetchHelloMessageSpy).toHaveBeenCalledTimes(1);
    expect(message).toBe('NRCruz app');
  });
});
