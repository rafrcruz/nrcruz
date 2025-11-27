import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const helloRepository = require('../src/modules/hello/hello.repository');
const helloService = require('../src/modules/hello/hello.service');

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('helloService', () => {
  it('returns message from repository', async () => {
    const fetchHelloMessageSpy = vi
      .spyOn(helloRepository, 'fetchHelloMessage')
      .mockResolvedValue('NRCruz app');

    const message = await helloService.getHelloMessage();

    expect(fetchHelloMessageSpy).toHaveBeenCalledTimes(1);
    expect(message).toBe('NRCruz app');
  });
});
