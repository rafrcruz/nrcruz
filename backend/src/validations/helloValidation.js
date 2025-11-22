const Joi = require('joi');

const helloValidation = {
  query: Joi.object({
    nome: Joi.string().optional(),
  }).unknown(true),
};

module.exports = { helloValidation };
