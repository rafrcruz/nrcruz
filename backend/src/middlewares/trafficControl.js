const { config } = require('../config/env');

const rateLimitStore = new Map();

const shouldSkipPath = (path) =>
  config.traffic.rateLimit.skipPaths.some((prefix) => path.startsWith(prefix));

/**
 * Lightweight, in-memory rate limiter for small deployments.
 * - Tune RATE_LIMIT_MAX_REQUESTS and RATE_LIMIT_WINDOW_MS in the environment.
 * - Disable temporarily with RATE_LIMIT_ENABLED=false (useful for local debugging).
 */
const rateLimiter = (req, res, next) => {
  if (!config.traffic.rateLimit.enabled || shouldSkipPath(req.path)) {
    return next();
  }

  const now = Date.now();
  const windowMs = config.traffic.rateLimit.windowMs;
  const maxRequests = config.traffic.rateLimit.maxRequests;
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const entry = rateLimitStore.get(ip) || { count: 0, start: now };

  if (now - entry.start > windowMs) {
    entry.count = 0;
    entry.start = now;
  }

  entry.count += 1;
  rateLimitStore.set(ip, entry);

  if (entry.count > maxRequests) {
    const retryAfterSeconds = Math.ceil((windowMs - (now - entry.start)) / 1000);
    res.set('Retry-After', retryAfterSeconds.toString());
    return res.status(429).json({ error: { message: 'Too many requests, please try again later.' } });
  }

  return next();
};

const blockedUserAgents = [
  /curl/i,
  /wget/i,
  /python-requests/i,
  /libwww-perl/i,
  /scrapy/i,
  /httpclient/i,
  /spider/i,
  /crawler/i,
];

/**
 * Minimal bot filter to reject clearly automated traffic.
 * - Block empty User-Agent headers by default.
 * - Extend blockedUserAgents above to add new signatures; disable with BOT_FILTER_ENABLED=false.
 */
const userAgentFilter = (req, res, next) => {
  if (!config.traffic.botFilter.enabled || shouldSkipPath(req.path)) {
    return next();
  }

  const userAgent = req.get('user-agent');

  if (!userAgent?.trim()) {
    return res.status(400).json({ error: { message: 'User-Agent header is required.' } });
  }

  if (blockedUserAgents.some((pattern) => pattern.test(userAgent))) {
    return res
      .status(403)
      .json({ error: { message: 'Automated requests are not allowed for this resource.' } });
  }

  return next();
};

module.exports = { rateLimiter, userAgentFilter };
