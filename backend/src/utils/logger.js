const { inspect } = require('node:util');

const formatMessage = (level, messages) => {
  const timestamp = new Date().toISOString();
  const formattedMessages = messages
    .map(message => (typeof message === 'string' ? message : inspect(message, { depth: null })))
    .join(' ');

  return `[${timestamp}] [${level}] ${formattedMessages}`;
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
