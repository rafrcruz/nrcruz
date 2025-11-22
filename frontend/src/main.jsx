import React from 'react';
import ReactDOM from 'react-dom/client';
import { Flowbite } from 'flowbite-react';
import { AppProvider } from './context/AppContext';
import App from './app/App';
import './index.css';
import { logger } from './services/logger';
import { SentryErrorBoundary, initSentry } from './services/sentry.jsx';
import { registerGlobalErrorHandlers } from './services/globalErrorHandler';
import { config } from './config/env';
import { flowbiteTheme } from './styles/theme';

initSentry();
registerGlobalErrorHandlers();

logger.info('Starting React application', { env: config.env });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SentryErrorBoundary>
      <Flowbite theme={{ theme: flowbiteTheme }}>
        <AppProvider>
          <App />
        </AppProvider>
      </Flowbite>
    </SentryErrorBoundary>
  </React.StrictMode>,
);
