const dotenv = require('dotenv');

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const normalizedPort = Number.parseInt(process.env.PORT, 10);
const port = Number.isInteger(normalizedPort) && normalizedPort > 0 ? normalizedPort : 3001;
const sentryEnabled = (process.env.SENTRY_ENABLED || '').toLowerCase() === 'true';
const sentryDsn = process.env.SENTRY_DSN;

const config = {
  env,
  server: {
    port,
  },
  sentry: {
    enabled: sentryEnabled,
    dsn: sentryDsn,
  },
};

module.exports = { config };
