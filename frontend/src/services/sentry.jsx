import {
  ErrorBoundary,
  browserTracingIntegration,
  captureException,
  captureMessage,
  init,
} from '@sentry/react';
import PropTypes from 'prop-types';
import { config } from '../config/env';

const isSentryEnabled = Boolean(config.sentry?.enabled && config.sentry?.dsn);
let sentryInitialized = false;
const tracesSampleRate = 0.2; // Safe default for free tier; set to 0 to disable tracing or raise carefully if capacity allows.

const tracingIntegration = browserTracingIntegration({
  instrumentNavigation: true,
  instrumentPageLoad: true,
  traceFetch: true, // Captures fetch/XHR timings automatically, including API calls.
  tracePropagationTargets: [config.api?.baseUrl, /^\//].filter(Boolean),
  // The integration also records slow React updates/renders as part of the UI transaction timeline.
});

export function initSentry() {
  if (sentryInitialized || !isSentryEnabled) {
    return;
  }

  init({
    dsn: config.sentry.dsn,
    environment: config.env,
    // Performance tracing: page load, navigation, API calls, and slow component renders.
    integrations: [tracingIntegration],
    tracesSampleRate,
  });

  sentryInitialized = true;
}

export function captureWithSentry(error, context) {
  if (!sentryInitialized) {
    return;
  }

  if (error instanceof Error) {
    captureException(error, context);
    return;
  }

  const message = typeof error === 'string' ? error : 'Unknown error captured without details';
  captureMessage(message, { level: 'error', ...context });
}

export function isSentryReady() {
  return {
    enabled: isSentryEnabled,
    initialized: sentryInitialized,
  };
}

export function captureExceptionFromLogger(message, optionalParams = []) {
  if (!sentryInitialized) {
    return;
  }

  const [maybeError, ...rest] = optionalParams;

  if (maybeError instanceof Error) {
    captureException(maybeError, {
      level: 'error',
      extra: { message, params: rest },
    });
    return;
  }

  const hasParams = optionalParams.length > 0;
  captureMessage(message, {
    level: 'error',
    ...(hasParams ? { extra: { params: optionalParams } } : {}),
  });
}

export function SentryErrorBoundary({ children }) {
  if (!isSentryEnabled) {
    return children;
  }

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => {
        throw error;
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

SentryErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
