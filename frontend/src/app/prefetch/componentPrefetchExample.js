// Minimal example showing how to register and prefetch a lazy-loaded component
// without changing the current UI. This file is not imported in the bundle; it
// exists only as a reference for future navigation elements.
//
// The pattern below wires prefetching to high-intent signals (hover/focus) so
// the bundle is warmed up shortly before the user clicks. Avoid connecting it to
// every link or firing multiple preloads in parallel.

import { createPrefetchableComponent, prefetchComponent } from './componentPrefetcher';

// Register a lazy component so it can be prefetched later. The component is only
// loaded when `prefetchComponent` or React rendering triggers the importer.
const homePagePrefetch = createPrefetchableComponent(
  'home-page-prefetch-example',
  () => import('../features/hello/pages/HomePage'),
);

// Example object to illustrate how callers can organize handlers.
export const HomePagePrefetchExample = {
  Component: homePagePrefetch.LazyComponent,
  preloadOnHover: () => prefetchComponent('home-page-prefetch-example'),
  // Usage suggestion (do not activate in production without intent signals):
  // <Link
  //   to="/"
  //   onMouseEnter={HomePagePrefetchExample.preloadOnHover}
  //   onFocus={HomePagePrefetchExample.preloadOnHover}
  // >Home</Link>
};
