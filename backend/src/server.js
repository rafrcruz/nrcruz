const { app } = require('./app');
const { config } = require('./config/env');
const { logger } = require('./utils/logger');

const port = config.server.port;

app.listen(port, () => {
  logger.info(`Backend listening on http://localhost:${port} (env: ${config.env})`);
});
