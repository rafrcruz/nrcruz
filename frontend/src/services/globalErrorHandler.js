import { logger } from './logger';
import { captureWithSentry, isSentryReady } from './sentry';

const normalizeError = possibleError => {
  if (possibleError instanceof Error) {
    return possibleError;
  }

  if (typeof possibleError === 'string') {
    return new Error(possibleError);
  }

  return new Error('Unexpected error without details');
};

const safeSerialize = value => {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }

  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      logger.debug('Failed to serialize value for logging', error);
    }
  }

  return value ?? 'Unknown';
};

const reportToSentry = (error, context) => {
  const { enabled, initialized } = isSentryReady();
  if (!enabled || !initialized) {
    return;
  }

  captureWithSentry(error, context);
};

export const registerGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const handleGlobalError = (message, source, lineno, colno, error) => {
    const normalizedError = normalizeError(error ?? message);
    const context = {
      source: source || 'unknown',
      line: lineno,
      column: colno,
    };

    logger.error('Unhandled error captured globally', { ...context, error: normalizedError });
    reportToSentry(normalizedError, { extra: context });

    return false;
  };

  const handleUnhandledRejection = event => {
    const reason = event?.reason;
    const normalizedError = normalizeError(reason || 'Unhandled promise rejection');
    const serializedReason = safeSerialize(reason);

    logger.error('Unhandled promise rejection captured globally', {
      reason: serializedReason,
    });

    reportToSentry(normalizedError, { extra: { reason: serializedReason } });

    return false;
  };

  const previousOnError = window.onerror;
  window.onerror = (...args) => {
    handleGlobalError(...args);
    if (typeof previousOnError === 'function') {
      return previousOnError(...args);
    }
    return false;
  };

  const previousOnUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = event => {
    handleUnhandledRejection(event);
    if (typeof previousOnUnhandledRejection === 'function') {
      return previousOnUnhandledRejection(event);
    }
    return false;
  };
};
