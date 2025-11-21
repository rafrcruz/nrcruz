import { describe, it, expect } from 'vitest';
import { getHelloMessage } from '../src/services/helloService.js';

describe('helloService', () => {
  it('returns the hello message from the repository', () => {
    expect(getHelloMessage()).toBe('NRCruz app');
  });
});
