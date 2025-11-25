const express = require('express');
const compression = require('compression');

const { initSentry, getRequestHandler, getErrorHandler } = require('./config/sentry');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
const { securityHeaders } = require('./middlewares/securityHeaders');
const { corsMiddleware } = require('./middlewares/cors');
const { rateLimiter, userAgentFilter } = require('./middlewares/trafficControl');

const app = express();

// Inicializa o Sentry com tracing; mantém o app funcional mesmo sem DSN.
initSentry(app);

app.disable('x-powered-by');
app.use(corsMiddleware);
app.use(securityHeaders);
app.use(userAgentFilter);
app.use(rateLimiter);
app.use(compression());
app.use(express.json());

const sentryRequestHandler = getRequestHandler();
if (sentryRequestHandler) {
  app.use(sentryRequestHandler);
}

app.use(routes);

// Global error handler should be registered after routes
const sentryErrorHandler = getErrorHandler();
if (sentryErrorHandler) {
  // Captura exceções para o Sentry e segue o fluxo de erros existente.
  app.use(sentryErrorHandler);
}
app.use(errorHandler);

module.exports = { app };
