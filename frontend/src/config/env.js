const env = import.meta?.env ?? {};

const readRequiredEnvVar = name => {
  const rawValue = env?.[name];
  const value = typeof rawValue === 'string' ? rawValue.trim() : '';

  if (!value) {
    const message = `${name} is required. Set it in your Vite environment (.env, .env.local, or CI vars).`;

    console.error(message);
    throw new Error(message);
  }

  return value;
};

const apiBaseUrl = readRequiredEnvVar('VITE_API_BASE_URL');
const rawSentryEnabled = env?.VITE_SENTRY_ENABLED;
const sentryDsn = env?.VITE_SENTRY_DSN?.trim();
const sentryEnabled = ['true', '1', 'yes', 'on'].includes(String(rawSentryEnabled).toLowerCase());
const defaultLocale = 'pt-BR';
const defaultTimezone = 'America/Sao_Paulo';
const parseSampleRate = (value, defaultValue = 0) => {
  const parsed = Number.parseFloat(value);
  if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) {
    return parsed;
  }

  return defaultValue;
};

const tracesSampleRate = parseSampleRate(env?.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.2);
const replaysSessionSampleRate = parseSampleRate(env?.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE, 0);
const replaysOnErrorSampleRate = parseSampleRate(env?.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE, 1);

export const config = {
  env: env?.MODE || 'development',
  locale: defaultLocale,
  timezone: defaultTimezone,
  api: {
    baseUrl: apiBaseUrl,
  },
  sentry: {
    enabled: sentryEnabled && Boolean(sentryDsn),
    dsn: sentryDsn || '',
    tracesSampleRate,
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,
  },
};
