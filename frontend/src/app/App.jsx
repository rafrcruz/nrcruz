import { Suspense, lazy } from 'react';
import { withProfiler } from '@sentry/react';
import LoadingFallback from '../components/LoadingFallback';
import AppShell from '../components/layout/AppShell';

// Page-level components should be lazy-loaded to keep the initial bundle lean.
const HomePage = lazy(() => import('../features/hello/pages/HomePage'));

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
