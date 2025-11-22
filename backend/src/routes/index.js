const express = require('express');
const swaggerUi = require('swagger-ui-express');

const { openApiSpecification } = require('../docs/openapi');
const helloRoutes = require('../modules/hello/hello.routes');
const healthRoutes = require('../modules/health/health.routes');

const router = express.Router();

router.use('/api/hello', helloRoutes);
router.use('/health', healthRoutes);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecification));
router.get('/docs.json', (_req, res) => res.json(openApiSpecification));

module.exports = router;
