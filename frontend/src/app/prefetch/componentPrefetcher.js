import { lazy } from 'react';

// Registry that keeps a memoized loader for each lazy component/screen.
// The loaders are intentionally simple to avoid triggering aggressive downloads
// and can be called from interaction signals (hover, focus, viewport) to
// pre-warm the bundle before navigation.
const componentRegistry = new Map();

function memoizedLoader(importer) {
  let loadPromise;

  return () => {
    if (!loadPromise) {
      loadPromise = importer().catch(error => {
        // Reset the promise so future attempts can try again after a failure.
        loadPromise = null;
        throw error;
      });
    }
    return loadPromise;
  };
}

/**
 * Registers a lazy component with an identifier so it can be prefetched later.
 *
 * Usage example for a navigation link (keep it lightweight):
 *
 * const { LazyComponent: SettingsPage, preload: preloadSettingsPage } =
 *   createPrefetchableComponent('settings-page', () => import('../pages/Settings'));
 *
 * // Later, when rendering a link:
 * <Link
 *   to="/settings"
 *   onMouseEnter={() => prefetchComponent('settings-page')}
 *   onFocus={() => prefetchComponent('settings-page')}
 * />
 *
 * Prefer attaching prefetch to high-intent signals (hover/focus/viewport) and
 * avoid firing many preloads in parallel to keep the network calm.
 */
export function createPrefetchableComponent(id, importer) {
  if (componentRegistry.has(id)) {
    return componentRegistry.get(id);
  }

  const load = memoizedLoader(importer);
  const LazyComponent = lazy(load);

  const entry = { LazyComponent, preload: load };
  componentRegistry.set(id, entry);
  return entry;
}

/**
 * Triggers a prefetch for a registered component/screen.
 * No-op when the identifier is unknown to avoid accidental eager work.
 */
export function prefetchComponent(id) {
  const entry = componentRegistry.get(id);
  if (!entry) {
    return Promise.resolve();
  }
  return entry.preload();
}

/**
 * Returns a shallow snapshot for debugging purposes without exposing the
 * internal memoization state. This makes it easy to confirm which components
 * were registered without changing runtime behavior.
 */
export function getRegisteredComponents() {
  return Array.from(componentRegistry.keys());
}
