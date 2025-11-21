import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/services/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

import { getHelloMessage } from '../src/services/helloService';
import { apiClient } from '../src/services/apiClient';

describe('helloService.getHelloMessage', () => {
  it('returns the text body from the hello endpoint', async () => {
    apiClient.get.mockResolvedValue({
      text: vi.fn().mockResolvedValue('Hello front'),
    });

    const result = await getHelloMessage();

    expect(apiClient.get).toHaveBeenCalledWith('/api/hello');
    expect(result).toBe('Hello front');
  });
});
