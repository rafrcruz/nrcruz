const dotenv = require('dotenv');

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const normalizedPort = Number.parseInt(process.env.PORT, 10);
const port = Number.isInteger(normalizedPort) && normalizedPort > 0 ? normalizedPort : 3001;

const config = {
  env,
  server: {
    port,
  },
};

module.exports = { config };
