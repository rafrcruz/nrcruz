import { Suspense, lazy } from 'react';
import LoadingFallback from '../components/LoadingFallback';

// Page-level components should be lazy-loaded to keep the initial bundle lean.
const HomePage = lazy(() => import('../features/hello/pages/HomePage'));

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePage />
    </Suspense>
  );
}

export default App;
