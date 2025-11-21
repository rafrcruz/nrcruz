const express = require('express');

const helloController = require('../controllers/helloController');

const router = express.Router();

router.get('/api/hello', helloController.getHello);

module.exports = router;
