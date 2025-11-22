const { version } = require('../../package.json');

const openApiSpecification = {
  openapi: '3.0.3',
  info: {
    title: 'NRCruz API',
    version,
    description:
      'Documentação pública dos endpoints do backend NRCruz. Atualize este documento ao adicionar novas rotas.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Ambiente local',
    },
  ],
  paths: {
    '/api/hello': {
      get: {
        summary: 'Retorna a mensagem de saudação padrão.',
        description: 'Endpoint público que responde com uma string simples.',
        responses: {
          200: {
            description: 'Mensagem retornada com sucesso.',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: 'NRCruz app',
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        summary: 'Healthcheck da API.',
        description: 'Retorna o status da aplicação e informações de ambiente.',
        responses: {
          200: {
            description: 'API disponível.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },
                    env: {
                      type: 'string',
                      example: 'development',
                    },
                    version: {
                      type: 'string',
                      example: version,
                    },
                  },
                  required: ['status', 'env', 'version'],
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = { openApiSpecification };
