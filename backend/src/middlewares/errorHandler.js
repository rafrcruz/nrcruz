const { logger } = require('../utils/logger');
const { captureException } = require('../config/sentry');

const errorHandler = (err, _req, res, _next) => {
  if (err.type === 'validation' || err.status === 400) {
    logger.warn('Erro de validação interceptado:', err.message, err.details || err.stack);

    return res.status(400).json({
      error: {
        message: 'Requisição inválida. Verifique os dados enviados.',
        details: err.details,
      },
    });
  }

  logger.error('Erro não tratado:', err.message, err.stack);

  captureException(err);

  res.status(500).json({
    error: { message: 'Erro interno do servidor.' },
  });
};

module.exports = { errorHandler };
