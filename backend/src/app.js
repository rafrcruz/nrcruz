const express = require('express');
const cors = require('cors');
const compression = require('compression');

const { initSentry } = require('./config/sentry');
const { config } = require('./config/env');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
const { securityHeaders } = require('./middlewares/securityHeaders');
const { rateLimiter, userAgentFilter } = require('./middlewares/trafficControl');

initSentry();

const app = express();

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

app.use(routes);

// Global error handler should be registered after routes
app.use(errorHandler);

module.exports = { app };
