const Joi = require('joi');
const { logger } = require('../utils/logger');

/**
 * Cria um middleware de validação reutilizável para rotas Express.
 *
 * Exemplo de uso:
 *
 * const { validateRequest } = require('../middlewares/validation');
 * const helloValidation = {
 *   query: Joi.object({ nome: Joi.string().optional() }).unknown(true),
 * };
 * router.get('/api/hello', validateRequest(helloValidation), helloController.getHello);
 *
 * @param {Object} schemas - Esquemas Joi opcionais para body, params e query.
 * @param {Joi.ObjectSchema} [schemas.body]
 * @param {Joi.ObjectSchema} [schemas.params]
 * @param {Joi.ObjectSchema} [schemas.query]
 * @returns {Function} Middleware Express
 */
const validateRequest = (schemas = {}) => {
  return (req, _res, next) => {
    const targets = ['params', 'query', 'body'];
    const validationErrors = [];

    targets.forEach(target => {
      const schema = schemas[target];

      if (!schema || !Joi.isSchema(schema)) {
        return;
      }

      const { error } = schema.validate(req[target], {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: false,
        convert: false,
      });

      if (error) {
        const formattedDetails = error.details.map(detail => ({
          message: detail.message,
          path: detail.path,
        }));

        validationErrors.push(...formattedDetails);
      }
    });

    if (validationErrors.length > 0) {
      logger.warn('Erro de validação na requisição:', validationErrors);

      const validationError = new Error('Dados inválidos na requisição.');
      validationError.status = 400;
      validationError.details = validationErrors;
      validationError.type = 'validation';

      return next(validationError);
    }

    return next();
  };
};

module.exports = { validateRequest };
