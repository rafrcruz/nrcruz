import { describe, expect, it, vi } from 'vitest';

import { apiClient } from '../../../services/apiClient';
import { getHelloMessage } from './helloService';

vi.mock('../../../services/apiClient');

describe('helloService', () => {
  it('requests the hello message from the API', async () => {
    const response = { text: vi.fn().mockResolvedValue('NRCruz app') };
    apiClient.get.mockResolvedValue(response);

    const message = await getHelloMessage();

    expect(apiClient.get).toHaveBeenCalledWith('/api/hello');
    expect(response.text).toHaveBeenCalled();
    expect(message).toBe('NRCruz app');
  });
});
