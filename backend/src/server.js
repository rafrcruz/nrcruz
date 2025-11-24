const { app } = require('./app');
const { config } = require('./config/env');
const { logger } = require('./utils/logger');

const port = config.server.port;

const startServer = () =>
  app.listen(port, () => {
    logger.info(`Backend iniciado em http://localhost:${port} (ambiente: ${config.env})`);
  });

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { startServer };
