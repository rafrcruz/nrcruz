import { Suspense, lazy } from 'react';
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

export default App;
