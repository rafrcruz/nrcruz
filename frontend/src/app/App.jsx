import { Suspense } from 'react';
import { withProfiler } from '@sentry/react';
import LoadingFallback from '../components/LoadingFallback';
import AppShell from '../components/layout/AppShell';
import { createPrefetchableComponent } from './prefetch/componentPrefetcher';

// Page-level components should be lazy-loaded to keep the initial bundle lean.
// The helper below keeps the existing Suspense flow while enabling explicit
// prefetching for navigation-driven events (hover, focus, viewport). The
// prefetch call is optional and intentionally unused for now to preserve the
// current behavior.
const homePageRegistration = createPrefetchableComponent(
  'home-page',
  () => import('../features/hello/pages/HomePage')
);
export const preloadHomePage = homePageRegistration.preload;
const HomePage = homePageRegistration.LazyComponent;

// Example for future navigation elements:
// <Link to="/" onMouseEnter={() => prefetchComponent('home-page')} />
// Using memoized loaders keeps the bundle warm without spawning many parallel
// requests; avoid wiring this on every link simultaneously.

function App() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </Suspense>
    </AppShell>
  );
}

// The profiler wraps the root to capture slow renders without altering UI behavior.
export default withProfiler(App, { name: 'App' });
