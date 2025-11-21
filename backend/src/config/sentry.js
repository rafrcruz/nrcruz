const Sentry = require('@sentry/node');

const { config } = require('./env');
const { logger } = require('../utils/logger');

let isInitialized = false;

const initSentry = () => {
  if (!config.sentry.enabled) {
    return;
  }

  if (!config.sentry.dsn) {
    logger.warn('Sentry is enabled but no DSN was provided.');
    return;
  }

  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.env,
  });

  isInitialized = true;
  logger.info('Sentry initialized.');
};

const captureException = error => {
  if (isInitialized) {
    Sentry.captureException(error);
  }
};

module.exports = {
  initSentry,
  captureException,
};
