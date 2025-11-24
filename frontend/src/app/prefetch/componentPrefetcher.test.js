import { describe, expect, it, vi } from 'vitest';

const loadPrefetcher = async () => {
  vi.resetModules();
  return import('./componentPrefetcher');
};

const createImporter = () => vi.fn().mockResolvedValue({ default: () => null });

describe('componentPrefetcher', () => {
  it('registers a component only once and memoizes the loader', async () => {
    const prefetcher = await loadPrefetcher();
    const importer = createImporter();

    const entry = prefetcher.createPrefetchableComponent('settings', importer);
    const duplicate = prefetcher.createPrefetchableComponent('settings', vi.fn());

    expect(duplicate).toBe(entry);
    await prefetcher.prefetchComponent('settings');
    await prefetcher.prefetchComponent('settings');
    expect(importer).toHaveBeenCalledTimes(1);
    expect(prefetcher.getRegisteredComponents()).toEqual(['settings']);
  });

  it('resolves gracefully when an unknown component id is prefetched', async () => {
    const { prefetchComponent } = await loadPrefetcher();

    await expect(prefetchComponent('missing')).resolves.toBeUndefined();
  });

  it('retries a preload after an importer failure', async () => {
    const prefetcher = await loadPrefetcher();
    const importer = vi
      .fn()
      .mockRejectedValueOnce(new Error('load failure'))
      .mockResolvedValueOnce({ default: () => null });

    const entry = prefetcher.createPrefetchableComponent('unstable', importer);
    await expect(entry.preload()).rejects.toThrow('load failure');

    await expect(prefetcher.prefetchComponent('unstable')).resolves.toBeDefined();
    expect(importer).toHaveBeenCalledTimes(2);
  });
});
