const express = require('express');
const cors = require('cors');
const compression = require('compression');

const { initSentry, getRequestHandler, getErrorHandler } = require('./config/sentry');
const { config } = require('./config/env');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
const { securityHeaders } = require('./middlewares/securityHeaders');
const { rateLimiter, userAgentFilter } = require('./middlewares/trafficControl');

const app = express();

// Inicializa o Sentry com tracing; mantém o app funcional mesmo sem DSN.
initSentry(app);

app.disable('x-powered-by');

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin && config.cors.allowNoOrigin) {
      return callback(null, true);
    }

    if (config.cors.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: config.cors.allowCredentials,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
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
