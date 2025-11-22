const Sentry = require('@sentry/node');

const { config } = require('./env');
const { logger } = require('../utils/logger');

let isInitialized = false;
const DEFAULT_TRACES_SAMPLE_RATE = 0.2; // Ajuste aqui caso precise de menos ou mais amostragem.

const initSentry = (app) => {
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
    // Habilita o tracing de performance para cada requisição HTTP.
    tracesSampleRate: config.sentry.tracesSampleRate ?? DEFAULT_TRACES_SAMPLE_RATE,
    integrations: (integrations) => {
      const sentryIntegrations = [...integrations];

      // A integração do Express ativa spans automáticos para middlewares e handlers.
      if (app) {
        sentryIntegrations.push(Sentry.expressIntegration({ app }));
      }

      return sentryIntegrations;
    },
  });

  isInitialized = true;
  logger.info('Sentry inicializado.');
};

const captureException = error => {
  if (isInitialized) {
    Sentry.captureException(error);
  }
};

const getRequestHandler = () => {
  if (!isInitialized) {
    return null;
  }

  // Mantém o request disponível para o Sentry antes das rotas, sem alterar respostas.
  return (req, _res, next) => {
    Sentry.getIsolationScope().setSDKProcessingMetadata({ request: req });
    next();
  };
};

const getErrorHandler = () => {
  if (!isInitialized) {
    return null;
  }

  // Passa os erros adiante para os handlers existentes após registrar no Sentry.
  return Sentry.expressErrorHandler();
};

module.exports = {
  initSentry,
  captureException,
  getRequestHandler,
  getErrorHandler,
};
