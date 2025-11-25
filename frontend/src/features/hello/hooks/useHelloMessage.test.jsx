import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getHelloMessage } from '../services/helloService';
import { useHelloMessage } from './useHelloMessage';

vi.mock('../services/helloService');

afterEach(() => {
  vi.clearAllMocks();
});

describe('useHelloMessage', () => {
  it('loads and exposes the hello message', async () => {
    getHelloMessage.mockResolvedValue('NRCruz app');

    const { result } = renderHook(() => useHelloMessage());

    expect(result.current.loading).toBe(true);
    expect(result.current.message).toBe('');

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.message).toBe('NRCruz app');
    expect(result.current.error).toBeNull();
  });

  it('handles errors when fetching the message fails', async () => {
    const error = new Error('Request failed');
    getHelloMessage.mockRejectedValue(error);

    const { result } = renderHook(() => useHelloMessage());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.message).toBe('');
    expect(result.current.error).toBe(error);
  });

  it('avoids state updates when unmounted before the fetch resolves', async () => {
    let resolveMessage;
    const delayedMessage = new Promise(resolve => {
      resolveMessage = resolve;
    });

    getHelloMessage.mockReturnValue(delayedMessage);

    const { unmount } = renderHook(() => useHelloMessage());
    unmount();

    resolveMessage('Late hello');
    await delayedMessage;

    // No assertions needed beyond ensuring the promise resolves without warnings or errors.
    expect(getHelloMessage).toHaveBeenCalledTimes(1);
  });
});
