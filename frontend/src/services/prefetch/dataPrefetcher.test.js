import { describe, expect, it, vi } from 'vitest';

const loadPrefetcher = async () => {
  vi.resetModules();
  return import('./dataPrefetcher');
};

describe('dataPrefetcher', () => {
  it('prefetches data, caches it and consumes only once', async () => {
    const { prefetchData, consumePrefetchedData } = await loadPrefetcher();
    const fetcher = vi.fn().mockResolvedValue({ name: 'Ada Lovelace' });

    await expect(prefetchData('profile', fetcher)).resolves.toEqual({ name: 'Ada Lovelace' });
    expect(fetcher).toHaveBeenCalledTimes(1);

    expect(consumePrefetchedData('profile')).toEqual({ name: 'Ada Lovelace' });
    expect(consumePrefetchedData('profile')).toBeUndefined();
  });

  it('rejects when called without a valid key or fetcher', async () => {
    const { prefetchData } = await loadPrefetcher();

    await expect(prefetchData('', () => Promise.resolve())).rejects.toThrow(
      /requires a key and a fetcher/,
    );
    await expect(prefetchData('missing')).rejects.toThrow(/requires a key and a fetcher/);
  });

  it('reuses the same promise while a key is cached', async () => {
    const { prefetchData } = await loadPrefetcher();
    const fetcher = vi.fn().mockResolvedValue('cached');

    const first = prefetchData('resource', fetcher);
    const second = prefetchData('resource', fetcher);

    await expect(first).resolves.toBe('cached');
    await expect(second).resolves.toBe('cached');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('evicts cache on error and allows a retry', async () => {
    const { prefetchData, consumePrefetchedData } = await loadPrefetcher();
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce('recovered');

    await expect(prefetchData('retryable', fetcher)).rejects.toThrow('boom');

    await expect(prefetchData('retryable', fetcher)).resolves.toBe('recovered');
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(consumePrefetchedData('retryable')).toBe('recovered');
  });

  it('clearPrefetch removes entries selectively or entirely', async () => {
    const { prefetchData, consumePrefetchedData, clearPrefetch } = await loadPrefetcher();
    const fetcher = vi.fn().mockResolvedValue('value');

    await prefetchData('keep', fetcher);
    await prefetchData('drop', fetcher);

    clearPrefetch('drop');
    expect(consumePrefetchedData('drop')).toBeUndefined();

    clearPrefetch();
    expect(consumePrefetchedData('keep')).toBeUndefined();
  });
});
