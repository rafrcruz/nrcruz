// Serverless entrypoint for Vercel: reuse the Express app as the handler.
const { app } = require('../src/app');

module.exports = (req, res) => app(req, res);
