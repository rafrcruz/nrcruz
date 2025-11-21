import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import App from './app/App';
import './index.css';
import { logger } from './services/logger';
import { SentryErrorBoundary, initSentry } from './services/sentry';
import { registerGlobalErrorHandlers } from './services/globalErrorHandler';
import { config } from './config/env';

initSentry();
registerGlobalErrorHandlers();

logger.info('Starting React application', { env: config.env });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SentryErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </SentryErrorBoundary>
  </React.StrictMode>,
);
