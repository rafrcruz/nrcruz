const { logger } = require('../utils/logger');

const errorHandler = (err, _req, res, _next) => {
  logger.error('Unhandled error:', err.message, err.stack);

  res.status(500).json({
    error: { message: 'Erro interno do servidor.' },
  });
};

module.exports = { errorHandler };
