const Sentry = require('@sentry/node');

const { config } = require('./env');
const { logger } = require('../utils/logger');

let isInitialized = false;
const DEFAULT_TRACES_SAMPLE_RATE = 0.2; // Ajuste aqui caso precise de menos ou mais amostragem.
const DEFAULT_PROFILES_SAMPLE_RATE = 0;

const SERVICE_NAME = 'nrcruz-backend';

const initSentry = app => {
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
    serverName: SERVICE_NAME,
    // Habilita o tracing de performance e, opcionalmente, perfis de CPU.
    tracesSampleRate: config.sentry.tracesSampleRate ?? DEFAULT_TRACES_SAMPLE_RATE,
    profilesSampleRate: config.sentry.profilesSampleRate ?? DEFAULT_PROFILES_SAMPLE_RATE,
    integrations: integrations => {
      const sentryIntegrations = [
        Sentry.httpIntegration(),
        Sentry.postgresIntegration(),
        ...integrations,
      ];

      // A integração do Express ativa spans automáticos para middlewares e handlers.
      if (app) {
        sentryIntegrations.push(Sentry.expressIntegration({ app }));
      }

      return sentryIntegrations;
    },
  });

  Sentry.setTag('service.name', SERVICE_NAME);

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
