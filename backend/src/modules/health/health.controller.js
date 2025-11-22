const { config } = require('../../config/env');
const { version } = require('../../../package.json');

const getHealth = (_req, res) => {
  res.json({ status: 'ok', env: config.env, version });
};

module.exports = { getHealth };
