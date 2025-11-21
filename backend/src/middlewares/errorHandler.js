const { logger } = require('../utils/logger');
const { captureException } = require('../config/sentry');

const errorHandler = (err, _req, res, _next) => {
  logger.error('Erro não tratado:', err.message, err.stack);

  captureException(err);

  res.status(500).json({
    error: { message: 'Erro interno do servidor.' },
  });
};

module.exports = { errorHandler };
