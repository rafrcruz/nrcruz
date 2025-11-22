const { version: packageVersion } = require('../../package.json');

const openApiSpecification = {
  openapi: '3.0.3',
  info: {
    title: 'NRCruz API',
    version: '1.0.0',
    description:
      'Documentação pública dos endpoints do backend NRCruz. Atualize este documento ao adicionar novas rotas.',
  },
  tags: [
    {
      name: 'API Versioning',
      description:
        'A versão atual da API é a v1. Novas versões podem ser adicionadas criando namespaces dedicados (ex.: /v2), e mantendo as rotas existentes para compatibilidade. Schemas podem ser duplicados ou ajustados em components para acomodar breaking changes, e múltiplas versões podem coexistir na documentação para facilitar migrações.',
    },
    {
      name: 'v1',
      description: 'Endpoints da versão 1 da API. Todos os paths atuais pertencem a esta versão.',
    },
    {
      name: 'Hello',
      description: 'Endpoints relacionados a mensagens de saudação e exemplos simples.',
    },
    {
      name: 'Healthcheck',
      description: 'Endpoints de monitoramento de disponibilidade e status da aplicação.',
    },
  ],
  'x-api-versioning': {
    overview:
      'A documentação suporta múltiplas versões em paralelo. A versão 1 é a base atual e novas versões devem ser adicionadas sem remover a anterior.',
    guidelines: [
      'Crie novos namespaces de rotas versionadas quando houver breaking changes (por exemplo, /v2).',
      'Duplique ou ajuste schemas em components para refletir mudanças incompatíveis em novas versões.',
      'Mantenha tags e seções separadas para cada versão na documentação, permitindo consulta paralela.',
    ],
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
        tags: ['v1', 'Hello'],
        summary: 'Retorna a mensagem de saudação padrão.',
        description: 'Endpoint público que responde com uma string simples.',
        responses: {
          200: {
            description: 'Mensagem retornada com sucesso.',
            content: {
              'text/plain': {
                schema: {
                  $ref: '#/components/schemas/HelloMessage',
                },
              },
            },
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['v1', 'Healthcheck'],
        summary: 'Healthcheck da API.',
        description: 'Retorna o status da aplicação e informações de ambiente.',
        responses: {
          200: {
            description: 'API disponível.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthcheckResponse',
                },
              },
            },
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ErrorResponse: {
        type: 'object',
        description: 'Formato padrão de erros retornados pela API.',
        properties: {
          statusCode: {
            type: 'integer',
            format: 'int32',
            description: 'Código HTTP retornado pela requisição.',
            example: 500,
          },
          message: {
            type: 'string',
            description: 'Descrição amigável do problema.',
            example: 'Erro interno inesperado.',
          },
          errorId: {
            type: 'string',
            nullable: true,
            description: 'Identificador interno opcional para rastrear o erro.',
            example: 'ERR-123',
          },
        },
        required: ['statusCode', 'message'],
      },
      SimpleSuccess: {
        type: 'object',
        description: 'Estrutura genérica para respostas de sucesso simples.',
        properties: {
          message: {
            type: 'string',
            description: 'Mensagem descritiva do sucesso da operação.',
            example: 'Operação concluída com sucesso.',
          },
        },
        required: ['message'],
      },
      HelloMessage: {
        type: 'string',
        description: 'Mensagem de saudação retornada pelo endpoint /api/hello.',
        example: 'NRCruz app',
      },
      HealthcheckResponse: {
        type: 'object',
        description: 'Informações de status e ambiente da aplicação.',
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
            example: packageVersion,
          },
        },
        required: ['status', 'env', 'version'],
      },
    },
    responses: {
      InternalServerError: {
        description: 'Erro interno inesperado.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
};

// Para documentar novas rotas, reutilize schemas em components.schemas ou components.responses
// sempre que possível. Declare o método em paths, informe status code, descrição, content type
// e utilize $ref para manter consistência com os modelos existentes.

module.exports = { openApiSpecification };
