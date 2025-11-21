const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
};

export const logger = {
  info(message, ...optionalParams) {
    console.info(formatMessage('INFO', message), ...optionalParams);
  },
  warn(message, ...optionalParams) {
    console.warn(formatMessage('WARN', message), ...optionalParams);
  },
  error(message, ...optionalParams) {
    console.error(formatMessage('ERROR', message), ...optionalParams);
  },
  debug(message, ...optionalParams) {
    console.debug(formatMessage('DEBUG', message), ...optionalParams);
  },
};
