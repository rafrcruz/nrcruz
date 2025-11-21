const Sentry = require('@sentry/node');

const { config } = require('./env');
const { logger } = require('../utils/logger');

let isInitialized = false;

const initSentry = () => {
  if (!config.sentry.enabled) {
    return;
  }

  if (!config.sentry.dsn) {
    logger.warn('Sentry habilitado, mas nenhuma DSN foi fornecida.');
    return;
  }

  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.env,
  });

  isInitialized = true;
  logger.info('Sentry inicializado.');
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
