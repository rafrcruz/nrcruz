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

export function initSentry() {
  if (sentryInitialized || !isSentryEnabled) {
    return;
  }

  init({
    dsn: config.sentry.dsn,
    environment: config.env,
    integrations: [browserTracingIntegration()],
    tracesSampleRate: 1,
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
