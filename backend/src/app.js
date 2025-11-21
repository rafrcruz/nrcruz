const express = require('express');
const cors = require('cors');

const { initSentry } = require('./config/sentry');
const { config } = require('./config/env');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

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
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(routes);

// Global error handler should be registered after routes
app.use(errorHandler);

module.exports = { app };
