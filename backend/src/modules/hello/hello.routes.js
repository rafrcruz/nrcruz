const express = require('express');

const { validateRequest } = require('../../middlewares/validation');
const helloController = require('./hello.controller');
const { helloValidation } = require('./hello.validation');

const router = express.Router();

router.get('/', validateRequest(helloValidation), helloController.getHello);

module.exports = router;
