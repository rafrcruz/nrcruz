const express = require('express');
const swaggerUi = require('swagger-ui-express');

const helloController = require('../controllers/helloController');
const healthController = require('../controllers/healthController');
const { openApiSpecification } = require('../docs/openapi');
const { validateRequest } = require('../middlewares/validation');
const { helloValidation } = require('../validations/helloValidation');

const router = express.Router();

router.get('/api/hello', validateRequest(helloValidation), helloController.getHello);
router.get('/health', healthController.getHealth);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecification));
router.get('/docs.json', (_req, res) => res.json(openApiSpecification));

module.exports = router;
