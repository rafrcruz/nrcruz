const express = require('express');
const cors = require('cors');

const { initSentry } = require('./config/sentry');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

initSentry();

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

// Global error handler should be registered after routes
app.use(errorHandler);

module.exports = { app };
