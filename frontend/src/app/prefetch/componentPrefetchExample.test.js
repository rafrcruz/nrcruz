import { describe, expect, it, vi } from 'vitest';

const mockRegistry = new Map();

vi.mock('./componentPrefetcher', () => {
  const createPrefetchableComponent = vi.fn((id, importer) => {
    const entry = { LazyComponent: `lazy-${id}`, preload: vi.fn(importer) };
    mockRegistry.set(id, entry);
    return entry;
  });

  const prefetchComponent = vi.fn(id => {
    const entry = mockRegistry.get(id);
    return entry ? entry.preload() : Promise.resolve();
  });

  return { createPrefetchableComponent, prefetchComponent, __mockRegistry: mockRegistry };
});

describe('componentPrefetchExample', () => {
  it('exposes a helper wired to the prefetch utilities', async () => {
    const { HomePagePrefetchExample } = await import('./componentPrefetchExample');
    const prefetcher = await import('./componentPrefetcher');
    const registryEntry = prefetcher.__mockRegistry.get('home-page-prefetch-example');

    expect(prefetcher.createPrefetchableComponent).toHaveBeenCalledWith(
      'home-page-prefetch-example',
      expect.any(Function)
    );
    expect(HomePagePrefetchExample.Component).toBe(registryEntry.LazyComponent);

    await HomePagePrefetchExample.preloadOnHover();
    expect(prefetcher.prefetchComponent).toHaveBeenCalledWith('home-page-prefetch-example');
    expect(registryEntry.preload).toHaveBeenCalled();
  });
});
