const { inspect } = require('node:util');

const { config } = require('../config/env');

const formatMessage = (level, messages) => {
  const timestamp = new Date().toISOString();
  const timezoneTag = config.localization.timezone;
  const formattedMessages = messages
    .map(message => (typeof message === 'string' ? message : inspect(message, { depth: null })))
    .join(' ');

  // Os horários registrados permanecem em UTC; o timezone lógico da aplicação é informado para evitar ambiguidades.
  return `[${timestamp} | TZ:${timezoneTag}] [${level}] ${formattedMessages}`;
};

const logger = {
  info: (...messages) => {
    console.log(formatMessage('INFO', messages));
  },
  warn: (...messages) => {
    console.warn(formatMessage('WARN', messages));
  },
  error: (...messages) => {
    console.error(formatMessage('ERROR', messages));
  },
  debug: (...messages) => {
    console.debug(formatMessage('DEBUG', messages));
  },
};

module.exports = { logger };
