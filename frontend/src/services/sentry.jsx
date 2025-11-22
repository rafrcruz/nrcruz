import * as Sentry from '@sentry/react';
import PropTypes from 'prop-types';
import { config } from '../config/env';

const isSentryEnabled = Boolean(config.sentry?.enabled && config.sentry?.dsn);
let sentryInitialized = false;

export function initSentry() {
  if (sentryInitialized || !isSentryEnabled) {
    return;
  }

  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.env,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1,
  });

  sentryInitialized = true;
}

export function captureWithSentry(error, context) {
  if (!sentryInitialized) {
    return;
  }

  if (error instanceof Error) {
    Sentry.captureException(error, context);
    return;
  }

  const message = typeof error === 'string' ? error : 'Unknown error captured without details';
  Sentry.captureMessage(message, { level: 'error', ...context });
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
    Sentry.captureException(maybeError, {
      level: 'error',
      extra: { message, params: rest },
    });
    return;
  }

  const hasParams = optionalParams.length > 0;
  Sentry.captureMessage(message, {
    level: 'error',
    ...(hasParams ? { extra: { params: optionalParams } } : {}),
  });
}

export function SentryErrorBoundary({ children }) {
  if (!isSentryEnabled) {
    return children;
  }

  return (
    <Sentry.ErrorBoundary
      fallbackRender={({ error }) => {
        throw error;
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

SentryErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
