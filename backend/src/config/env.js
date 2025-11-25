const dotenv = require('dotenv');

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

const parseInteger = (value, defaultValue) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : defaultValue;
};

const parseSampleRate = (value, defaultValue) => {
  const parsed = Number.parseFloat(value);
  if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) {
    return parsed;
  }

  return defaultValue;
};
const normalizedPort = Number.parseInt(process.env.PORT, 10);
const port = Number.isInteger(normalizedPort) && normalizedPort > 0 ? normalizedPort : 3001;
const databaseUrl = process.env.DATABASE_URL;
const sentryEnabled = (process.env.SENTRY_ENABLED || '').toLowerCase() === 'true';
const sentryDsn = process.env.SENTRY_DSN;
const parsedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
// Adjust CORS_ALLOWED_ORIGINS in the environment to override these defaults.
// Include Vite dev/preview ports so the frontend can call the API without CORS errors out of the box.
const allowedOrigins =
  parsedOrigins.length > 0
    ? parsedOrigins
    : [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
        'http://127.0.0.1:4173',
      ];
const allowCredentials = (process.env.CORS_ALLOW_CREDENTIALS || '').toLowerCase() === 'true';
const allowNoOrigin = (process.env.CORS_ALLOW_NO_ORIGIN || 'true').toLowerCase() === 'true';
const defaultLocale = process.env.APP_LOCALE || 'pt-BR';
// Mantemos os horários de infraestrutura em UTC, mas o fuso horário lógico de negócio é o do Brasil.
const defaultTimezone = process.env.APP_TIMEZONE || 'America/Sao_Paulo';
// Ajuste o sample rate de tracing do Sentry (0.0 - 1.0). Manter valores baixos evita estourar limites.
const sentryTracesSampleRate = parseSampleRate(process.env.SENTRY_TRACES_SAMPLE_RATE, 0.2);

const rateLimitEnabled = parseBoolean(process.env.RATE_LIMIT_ENABLED, true);
const rateLimitWindowMs = parseInteger(process.env.RATE_LIMIT_WINDOW_MS, 60 * 1000);
const rateLimitMaxRequests = parseInteger(process.env.RATE_LIMIT_MAX_REQUESTS, 100);
const rateLimitSkipPaths = (process.env.RATE_LIMIT_SKIP_PATHS || '/health')
  .split(',')
  .map(path => path.trim())
  .filter(Boolean);
const botFilterEnabled = parseBoolean(process.env.BOT_FILTER_ENABLED, true);
const blobReadWriteToken = process.env.BLOB_READ_WRITE_TOKEN || '';
const blobBaseUrl =
  process.env.BLOB_BASE_URL?.trim() || 'https://bvnmlsi45glh5ix7.public.blob.vercel-storage.com';
const blobStoreId = process.env.BLOB_STORE_ID || 'store_BvNmLSi45Glh5iX7';
const blobStoreName = process.env.BLOB_STORE_NAME || 'nrcruz-backend-blob';
const blobRegion = process.env.BLOB_REGION || 'iad1';

const config = {
  env,
  server: {
    port,
  },
  database: {
    url: databaseUrl,
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
    tracesSampleRate: sentryTracesSampleRate,
  },
  traffic: {
    rateLimit: {
      enabled: rateLimitEnabled,
      windowMs: rateLimitWindowMs,
      maxRequests: rateLimitMaxRequests,
      skipPaths: rateLimitSkipPaths,
    },
    botFilter: {
      enabled: botFilterEnabled,
    },
  },
  blobStorage: {
    token: blobReadWriteToken,
    baseUrl: blobBaseUrl.replace(/\/+$/, ''),
    storeId: blobStoreId,
    storeName: blobStoreName,
    region: blobRegion,
  },
};

module.exports = { config };
