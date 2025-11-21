const express = require('express');

const helloController = require('../controllers/helloController');
const healthController = require('../controllers/healthController');

const router = express.Router();

router.get('/api/hello', helloController.getHello);
router.get('/health', healthController.getHealth);

module.exports = router;
