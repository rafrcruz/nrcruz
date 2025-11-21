const { app } = require('./app');
const { config } = require('./config/env');

const port = config.server.port;

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port} (env: ${config.env})`);
});
