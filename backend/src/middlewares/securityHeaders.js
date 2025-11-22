const helmet = require('helmet');
const { config } = require('../config/env');

// Central configuration for security-related HTTP headers applied to most responses.
// Adjust CSP directives below to add trusted CDNs or new asset domains (e.g. scriptSrc: ["'self'", 'https://cdn.example.com']).
// HSTS is enabled by default in production; set HSTS_ENABLED=false to relax it (useful for local development over HTTP).
const isProduction = config.env === 'production';
const hstsEnabled = process.env.HSTS_ENABLED
  ? process.env.HSTS_ENABLED.toLowerCase() === 'true'
  : isProduction;

const disableCsp = (process.env.DISABLE_CSP || '').toLowerCase() === 'true';

const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:', 'https:'],
  fontSrc: ["'self'", 'data:', 'https:'],
  connectSrc: ["'self'", 'https:'],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  frameAncestors: ["'self'"],
};

const securityHeaders = helmet({
  contentSecurityPolicy: disableCsp
    ? false
    : {
        directives: cspDirectives,
      },
  frameguard: { action: 'sameorigin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: hstsEnabled
    ? {
        maxAge: 60 * 60 * 24 * 180, // 180 days
        includeSubDomains: true,
        preload: false,
      }
    : false,
  // Retain existing cross-origin protections while allowing asset sharing when needed.
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  permissionsPolicy: {
    features: {
      geolocation: ["'none'"],
      microphone: ["'none'"],
      camera: ["'none'"],
      payment: ["'none'"],
      usb: ["'none'"],
      bluetooth: ["'none'"],
    },
  },
});

module.exports = { securityHeaders };
