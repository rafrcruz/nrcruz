const buildCorsOptions = corsConfig => {
  const allowedOrigins = new Set(corsConfig.allowedOrigins);

  return {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, corsConfig.allowNoOrigin);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: corsConfig.allowCredentials,
    optionsSuccessStatus: 204,
  };
};

const createCorsMiddleware = () => {
  const cors = require('cors');
  const { config } = require('../config/env');
  return cors(buildCorsOptions(config.cors));
};

module.exports = { createCorsMiddleware, buildCorsOptions };
