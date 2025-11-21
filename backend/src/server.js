const { app } = require('./app');
const { config } = require('./config/env');
const { logger } = require('./utils/logger');

const port = config.server.port;

app.listen(port, () => {
  logger.info(`Backend iniciado em http://localhost:${port} (ambiente: ${config.env})`);
});
