const cors = require('cors');
const { config } = require('../config/env');

const allowedOrigins = new Set(config.cors.allowedOrigins);
const defaultOptions = { optionsSuccessStatus: 204 };

const corsMiddleware = (req, res, next) => {
  const requestOrigin = req.header('Origin');

  const credentialsEnabled = config.cors.allowCredentials && Boolean(requestOrigin);

  if (!requestOrigin) {
    if (!config.cors.allowNoOrigin) {
      return next();
    }

    const options = { ...defaultOptions, origin: '*', credentials: credentialsEnabled };
    return cors(options)(req, res, next);
  }

  if (!allowedOrigins.has(requestOrigin)) {
    return next();
  }

  const options = {
    ...defaultOptions,
    origin: requestOrigin,
    credentials: credentialsEnabled,
  };

  return cors(options)(req, res, next);
};

module.exports = { corsMiddleware };
