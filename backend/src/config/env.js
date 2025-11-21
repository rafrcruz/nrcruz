const dotenv = require('dotenv');

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const normalizedPort = Number.parseInt(process.env.PORT, 10);
const port = Number.isInteger(normalizedPort) && normalizedPort > 0 ? normalizedPort : 3001;
const sentryEnabled = (process.env.SENTRY_ENABLED || '').toLowerCase() === 'true';
const sentryDsn = process.env.SENTRY_DSN;
const parsedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
// Adjust CORS_ALLOWED_ORIGINS in the environment to override these defaults.
const allowedOrigins =
  parsedOrigins.length > 0 ? parsedOrigins : ['http://localhost:3000', 'http://127.0.0.1:3000'];
const allowCredentials = (process.env.CORS_ALLOW_CREDENTIALS || '').toLowerCase() === 'true';
const allowNoOrigin = (process.env.CORS_ALLOW_NO_ORIGIN || 'true').toLowerCase() === 'true';
const defaultLocale = process.env.APP_LOCALE || 'pt-BR';
// Mantemos os horários de infraestrutura em UTC, mas o fuso horário lógico de negócio é o do Brasil.
const defaultTimezone = process.env.APP_TIMEZONE || 'America/Sao_Paulo';

const config = {
  env,
  server: {
    port,
  },
  cors: {
    allowedOrigins,
    allowCredentials,
    allowNoOrigin,
  },
  localization: {
    locale: defaultLocale,
    timezone: defaultTimezone,
  },
  sentry: {
    enabled: sentryEnabled,
    dsn: sentryDsn,
  },
};

module.exports = { config };
